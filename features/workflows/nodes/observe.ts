import type { Stagehand } from "@browserbasehq/stagehand"

export async function observe({
    stagehand,
    instruction,
}: {
    stagehand: Stagehand
    instruction: string
}) {
    const actions = await stagehand.observe(instruction)

    // actions is an array of objects that typically contain selector and description.
    return {
        matches: JSON.stringify(actions, null, 2)
    }
}
