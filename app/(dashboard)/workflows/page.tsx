import { auth as clerkAuth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { listWorkflows } from "@/features/workflows/data"
import { WorkflowsHub } from "@/features/workflows/components/workflows-hub"

export const dynamic = "force-dynamic"

export default async function WorkflowsPage() {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    redirect("/session-tasks/choose-organization")
  }

  const workflows = await listWorkflows(orgId)

  return <WorkflowsHub initialWorkflows={workflows} />
}
