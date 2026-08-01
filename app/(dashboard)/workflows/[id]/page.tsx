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
  // defaultAccesses: [] → private; only the org group has write access.
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

  // getOrCreateRoom does not update existing rooms. We update it here 
  // to ensure legacy/existing rooms have their accesses synchronized,
  // but we only do it if the permission is actually missing to save an API call.
  const hasWriteAccess = room.groupsAccesses?.[orgId]?.includes("room:write")
  if (!hasWriteAccess) {
    await liveblocks.updateRoom(id, {
      defaultAccesses: [],
      groupsAccesses: {
        [orgId]: ["room:write"],
      },
    })
  }

  const publicAccessToken = await triggerAuth.createPublicToken({
    scopes: { read: { tags: [`workflow:${id}`] } },
    expirationTime: "1h",
  })

  return (
    <Room roomId={id}>
      <WorkflowRunsProvider workflowId={id} publicAccessToken={publicAccessToken}>
        <WorkflowShell workflowId={id} />
      </WorkflowRunsProvider>
    </Room>
  )
}

