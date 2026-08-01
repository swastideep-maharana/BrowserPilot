import type { Stagehand } from "@browserbasehq/stagehand";

import type {
    ActionNodeType, NodeType,
} from "@/features/workflows/nodes/node-registry"

import { openUrl } from "./open-url";
import { promises } from "dns";

export type NodeContext = {
    values: Record<string, string>
    getStagehand: () => Promise<Stagehand>
}

export type NodeExecutor = (ctx: NodeContext) => Promise<unknown>

export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
    "open-url": async ({ values, getStagehand }: NodeContext) =>
        openUrl({ stagehand: await getStagehand(), url: values.url }),
} satisfies Record<ActionNodeType, NodeExecutor>