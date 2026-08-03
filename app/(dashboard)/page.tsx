"use client"

import { useTransition } from "react"
import { Workflow, Plus } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createWorkflowAction } from "@/features/workflows/actions"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"

export default function Page() {
  const [isPending, startTransition] = useTransition()
  const { isPro, redirectToPricing } = useProPlan()

  function handleCreate() {
    if (!isPro) {
      redirectToPricing()
      return
    }

    startTransition(async () => {
      try {
        await createWorkflowAction(generateSlug())
      } catch (error) {
        // Next.js redirect throws NEXT_REDIRECT which should not be caught as an error
        if ((error as any)?.digest?.startsWith("NEXT_REDIRECT")) {
          throw error
        }
        toast.error("Failed to create workflow")
      }
    })
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-6">
      <Empty className="border-none max-w-md gap-6">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-20 rounded-2xl [&_svg:not([class*='size-'])]:size-9"
          >
            <Workflow />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold tracking-tight">
            No workflow selected
          </EmptyTitle>
          <EmptyDescription className="text-base text-muted-foreground">
            Select a workflow from the sidebar
            <br />
            or create a new one to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 px-8 py-6 text-base font-medium rounded-2xl h-auto"
            disabled={isPending}
            onClick={handleCreate}
          >
            <Plus className="size-5" />
            {isPending ? "Creating…" : "New workflow"}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

