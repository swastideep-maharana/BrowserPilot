import type { Stagehand } from "@browserbasehq/stagehand";

import type {
    ActionNodeType, NodeType,
} from "@/features/workflows/nodes/node-registry"

import { openUrl } from "./open-url";
import { act } from "./act";
import { extract } from "./extract";
import { promises } from "dns";

export type NodeContext = {
    values: Record<string, string>
    getStagehand: () => Promise<Stagehand>
}

export type NodeExecutor = (ctx: NodeContext) => Promise<unknown>

export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
    "open-url": async ({ values, getStagehand }: NodeContext) =>
        openUrl({ stagehand: await getStagehand(), url: values.url }),
    "act": async ({ values, getStagehand }: NodeContext) =>
        act({ stagehand: await getStagehand(), instruction: values.instruction }),
    "extract": async ({ values, getStagehand }: NodeContext) =>
        extract({ stagehand: await getStagehand(), instruction: values.instruction }),
} satisfies Record<ActionNodeType, NodeExecutor>