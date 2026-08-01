"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { runs, Task } from "@trigger.dev/sdk"
import { auth as triggerAuth, tasks } from "@trigger.dev/sdk"
import type { helloWorldTask } from "@/trigger/example"
import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"

import { createWorkflow, deleteWorkflow, saveWorkflowGraph } from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"
import type { WorkflowGraph } from "@/lib/db/schema"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization. Please select an organization.")
  }

  const workflow = await createWorkflow(orgId, name)

  revalidatePath("/", "layout")

  redirect(`/workflows/${workflow.id}`)
}

export async function saveWorkflowAction({ id, graph }: { id: string, graph: WorkflowGraph }) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization. Please select an organization.")
  }

  return await saveWorkflowGraph({ orgId, id, graph })
}

export async function runWorkflowAction(id: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization. Please select an organization.")
  }

  const handle = await tasks.trigger<typeof runWorkflowTask>(
    "run-workflow",
    { workflowId: id, orgId },
    { tags: [`workflow:${id}`] }
  );

  const publicAccessToken = await triggerAuth.createPublicToken({
    scopes: { read: { tags: [`workflow:${id}`] } },
  })

  return { runId: handle.id, publicAccessToken }
}

export async function cancelWorkflowRunAction(runId: string) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")
  await runs.cancel(runId)
}

export async function deleteWorkflowAction(workflowId: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization. Please select an organization.")
  }

  // First delete from Liveblocks. If it fails (e.g. room doesn't exist), we can still proceed or handle it
  try {
    await liveblocks.deleteRoom(workflowId)
  } catch (error) {
    console.error("Failed to delete Liveblocks room:", error)
  }

  // Delete from DB
  await deleteWorkflow(orgId, workflowId)

  revalidatePath("/", "layout")
  redirect("/")
}
