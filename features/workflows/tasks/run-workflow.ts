import toposort from "toposort";
import { logger, retry, task } from "@trigger.dev/sdk";
import type { Edge } from "@xyflow/react";

import { Stagehand } from "@browserbasehq/stagehand";
import { nodeExecutors } from "@/features/workflows/nodes/node-executors"
import { getWorkflow } from "@/features/workflows/data";
import type { WorkflowGraph } from "@/lib/db/schema";
import type { StepNodeType } from "@/features/workflows/nodes/node-registry";

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
                model: "google/gemini-2.5-flash",

                disablePino: true,
            })
            await stagehand.init()
            return stagehand
        }

        for (const id of order) {
            const node = byId.get(id)!
            logger.info(`Running step: ${node.data.title}`)
            // TODO: actually execute the node instead of just logging it, and report
            // its progress so the UI can watch the run live.
            const executor = nodeExecutors[node.data.type]
            if (executor) await executor({
                values: node.data.values,
                getStagehand

            })
        }
        await stagehand?.close()

        return { steps: order.length }
    }
})