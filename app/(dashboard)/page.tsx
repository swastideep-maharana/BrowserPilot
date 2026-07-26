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

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
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
          >
            <Plus className="size-5" />
            New workflow
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
