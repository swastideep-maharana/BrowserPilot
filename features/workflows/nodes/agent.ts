import type { Stagehand } from "@browserbasehq/stagehand"

export async function agent({
    stagehand,
    instruction,
}: {
    stagehand: Stagehand
    instruction: string
}) {
    const stagehandAgent = stagehand.agent({
        model: "google/gemini-2.0-flash",
        executionModel: "google/gemini-2.0-flash",
    })

    const result = await stagehandAgent.execute({
        instruction,
        maxSteps: 20,
    })

    return {
        success: result.success ? "true" : "false",
        message: result.message,
        isCompleted: result.completed ? "true" : "false"
    }
}
