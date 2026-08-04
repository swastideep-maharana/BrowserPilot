"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createWorkflowAction } from "@/features/workflows/actions"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import type { WorkflowTemplate } from "@/features/workflows/data/templates"
import type { WorkflowGraph } from "@/lib/db/schema"

interface CreateWorkflowOptions {
  name?: string
  template?: WorkflowTemplate
  graph?: WorkflowGraph
}

export function useCreateWorkflow() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { isPro, redirectToPricing } = useProPlan()

  function createWorkflow(options: CreateWorkflowOptions = {}) {
    if (!isPro) {
      redirectToPricing()
      return
    }

    const { name, template, graph } = options
    const workflowName =
      name ||
      (template ? `${template.title} (${generateSlug().slice(0, 4)})` : generateSlug())
    const initialGraph = template?.initialGraph || graph

    startTransition(async () => {
      try {
        const res = await createWorkflowAction(workflowName, initialGraph)
        if (res?.success) {
          toast.success(template ? `Created from "${template.title}" blueprint!` : "Workflow created!")
          router.push(`/workflows/${res.workflowId}`)
        } else if (res?.redirectTo) {
          router.push(res.redirectTo)
        } else if (res && !res.success) {
          toast.error(res.error || "Failed to create workflow")
        }
      } catch (error) {
        console.error("Error creating workflow:", error)
        toast.error("Failed to create workflow")
      }
    })
  }

  return {
    createWorkflow,
    isPending,
    isPro,
  }
}
