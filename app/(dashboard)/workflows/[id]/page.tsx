import { auth as clerkAuth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { auth as triggerAuth } from "@trigger.dev/sdk"

import { getWorkflow } from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"
import { Room } from "@/features/workflows/components/room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { WorkflowRunsProvider } from "@/features/workflows/components/workflow-runs-provider"

interface WorkflowPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params
  const { orgId } = await clerkAuth()
  if (!orgId) notFound()

  const workflow = await getWorkflow(orgId, id)
  if (!workflow) notFound()

  // Ensure the Liveblocks room exists and is scoped to this org.
  try {
    const room = await liveblocks.getOrCreateRoom(id, {
      organizationId: orgId,
      defaultAccesses: [],
      groupsAccesses: {
        [orgId]: ["room:write"],
      },
      metadata: {
        title: workflow.name,
      },
    })

    const hasWriteAccess = room.groupsAccesses?.[orgId]?.includes("room:write")
    if (!hasWriteAccess) {
      await liveblocks.updateRoom(id, {
        defaultAccesses: [],
        groupsAccesses: {
          [orgId]: ["room:write"],
        },
      })
    }
  } catch (liveblocksError) {
    console.error("Liveblocks room initialization error:", liveblocksError)
  }

  let publicAccessToken: string | undefined = undefined
  try {
    publicAccessToken = await triggerAuth.createPublicToken({
      scopes: { read: { tags: [`workflow:${id}`] } },
      expirationTime: "1h",
    })
  } catch (triggerError) {
    console.error("Trigger.dev public token generation error:", triggerError)
  }

  return (
    <Room roomId={id}>
      <WorkflowRunsProvider workflowId={id} publicAccessToken={publicAccessToken}>
        <WorkflowShell workflowId={id} />
      </WorkflowRunsProvider>
    </Room>
  )
}

