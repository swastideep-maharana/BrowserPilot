import { Workflow } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function WorkflowNotFound() {
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
            Workflow not found
          </EmptyTitle>
          <EmptyDescription className="text-base text-muted-foreground">
            This workflow doesn&apos;t exist or may have been deleted.
            <br />
            Select another workflow from the sidebar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
