"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { runs } from "@trigger.dev/sdk"
import { auth as triggerAuth, tasks } from "@trigger.dev/sdk"
import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"

import { createWorkflow, deleteWorkflow, saveWorkflowGraph } from "@/features/workflows/data"
import { liveblocks } from "@/lib/liveblocks"
import type { WorkflowGraph } from "@/lib/db/schema"

export type CreateWorkflowResult =
  | { success: true; workflowId: string }
  | { success: false; error: string; redirectTo?: string }

export async function createWorkflowAction(name: string): Promise<CreateWorkflowResult> {
  const { orgId, has } = await auth()

  if (!orgId) {
    return {
      success: false,
      error: "No active organization",
      redirectTo: "/session-tasks/choose-organization",
    }
  }

  const isPro = Boolean(
    has({ plan: "pro" }) ||
    has({ plan: "org:pro" }) ||
    has({ plan: "starter" }) ||
    has({ plan: "team" }) ||
    has({ plan: "pro_monthly" }) ||
    has({ plan: "pro_yearly" })
  )

  if (!isPro) {
    return {
      success: false,
      error: "Pro plan required",
      redirectTo: "/pricing",
    }
  }

  try {
    const workflow = await createWorkflow(orgId, name)
    revalidatePath("/", "layout")
    return { success: true, workflowId: workflow.id }
  } catch (err: any) {
    console.error("Error creating workflow:", err)
    return {
      success: false,
      error: err?.message || "Failed to create workflow in database",
    }
  }
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

export async function deleteWorkflowAction(workflowId: string): Promise<{ success: boolean; error?: string }> {
  const { orgId } = await auth()

  if (!orgId) {
    return { success: false, error: "No active organization" }
  }

  // First delete from Liveblocks. If it fails (e.g. room doesn't exist), we can still proceed or handle it
  try {
    await liveblocks.deleteRoom(workflowId)
  } catch (error) {
    console.error("Failed to delete Liveblocks room:", error)
  }

  try {
    await deleteWorkflow(orgId, workflowId)
    revalidatePath("/", "layout")
    return { success: true }
  } catch (err: any) {
    console.error("Failed to delete workflow:", err)
    return { success: false, error: err?.message || "Failed to delete workflow" }
  }
}
