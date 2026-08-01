import toposort from "toposort";
import { logger, retry, task, metadata } from "@trigger.dev/sdk";
import type { Edge } from "@xyflow/react";

import { Stagehand } from "@browserbasehq/stagehand";
import { interpolate } from "@/features/workflows/lib/interpolate";
import { nodeExecutors } from "@/features/workflows/nodes/node-executors"
import { getWorkflow } from "@/features/workflows/data";
import type { WorkflowGraph } from "@/lib/db/schema";
import type { StepNodeType } from "@/features/workflows/nodes/node-registry";

export type RunStep = {
    id: string;
    status: "pending" | "running" | "done" | "failed";
}

export const runWorkflowTask = task({
    id: "run-workflow",
    run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }) => {
        const workflow = await getWorkflow(orgId, workflowId)
        if (!workflow?.graph) throw new Error(`Workflow ${workflowId} has no graph`)

        const graph = workflow.graph as WorkflowGraph
        const { nodes, edges } = graph
        const byId = new Map(nodes.map((n) => [n.id, n]))

        // Run only connected nodes - anything touching an edge. Orphans dropped on
        // the canvas are skipped. toposort orders them and throws on a cycle.
        const connected = new Set(edges.flatMap((e) => [e.source, e.target]))

        const order = toposort.array(
            nodes.map((n) => n.id),
            edges.map((e) => [e.source, e.target])
        ).filter((id) => connected.has(id))

        logger.info(`Workflow ${workflowId} order:`, { order })

        let stagehand: Stagehand | undefined
        const getStagehand = async () => {
            if (stagehand) return stagehand
            stagehand = new Stagehand({
                env: "BROWSERBASE",
                apiKey: process.env.BROWSERBASE_API_KEY!,
                projectId: process.env.BROWSERBASE_PROJECT_ID,
                model: "google/gemini-2.5-flash",

                disablePino: true,
            })
            await stagehand.init()
            return stagehand
        }

        const steps: RunStep[] = order.map((id) => ({ id, status: "pending" }))
        metadata.set("steps", steps)

        const outputs: Record<string, any> = {}

        for (const id of order) {
            const node = byId.get(id)!
            logger.info(`Running step: ${node.data.title}`)
            // TODO: actually execute the node instead of just logging it, and report
            // its progress so the UI can watch the run live.
            const executor = nodeExecutors[node.data.type]
            if (executor) {
                const step = steps.find((s) => s.id === id)!
                step.status = "running"
                metadata.set("steps", steps)
                await metadata.flush()

                const interpolatedValues = Object.fromEntries(
                    Object.entries(node.data.values || {}).map(([key, val]) => [
                        key,
                        typeof val === "string" ? interpolate(val, outputs) : val,
                    ])
                )

                try {
                    outputs[id] = await executor({
                        values: interpolatedValues as Record<string, string>,
                        getStagehand
                    })
                    
                    step.status = "done"
                    metadata.set("steps", steps)
                } catch (error) {
                    step.status = "failed"
                    metadata.set("steps", steps)
                    await metadata.flush()
                    throw error
                }
            }
        }
        await stagehand?.close()

        return { steps }
    }
})