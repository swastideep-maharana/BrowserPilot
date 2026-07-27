"use client"

import { TriangleAlert } from "lucide-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

interface WorkflowErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function WorkflowError({ error, reset }: WorkflowErrorProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background p-6">
      <Empty className="border-none max-w-md gap-6">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-20 rounded-2xl [&_svg:not([class*='size-'])]:size-9 bg-destructive/10 text-destructive"
          >
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </EmptyTitle>
          <EmptyDescription className="text-base text-muted-foreground">
            {error.message || "An unexpected error occurred while loading this workflow."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 px-8 py-6 text-base font-medium rounded-2xl h-auto"
            onClick={reset}
          >
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
