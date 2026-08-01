import type { Stagehand } from "@browserbasehq/stagehand";

import type {
    ActionNodeType, NodeType,
} from "@/features/workflows/nodes/node-registry"

import { openUrl } from "./open-url";
import { act } from "./act";
import { extract } from "./extract";
import { observe } from "./observe";
import { agent } from "./agent";
import { sendEmail } from "./send-email";
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
    "observe": async ({ values, getStagehand }: NodeContext) =>
        observe({ stagehand: await getStagehand(), instruction: values.instruction }),
    "agent": async ({ values, getStagehand }: NodeContext) =>
        agent({ stagehand: await getStagehand(), instruction: values.instruction }),
    "send-email": async ({ values }: NodeContext) =>
        sendEmail({ to: values.to, subject: values.subject, body: values.body }),
} satisfies Record<ActionNodeType, NodeExecutor>