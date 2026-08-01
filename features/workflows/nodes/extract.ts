import type { Stagehand } from "@browserbasehq/stagehand"

export async function extract({
    stagehand,
    instruction,
}: {
    stagehand: Stagehand
    instruction: string
}) {
    const { extraction } = await stagehand.extract(instruction)

    return {
        // Handle cases where extraction could be a complex object or string
        extraction: typeof extraction === "string" ? extraction : JSON.stringify(extraction)
    }
}
