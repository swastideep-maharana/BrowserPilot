"use client"

import { useWorkflowRuns } from "@/features/workflows/components/workflow-runs-provider"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import type { NodeType } from "@/features/workflows/nodes/node-registry"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"
import prettyMilliseconds from "pretty-ms"
import { cn } from "@/lib/utils"

export function InspectorPanel({ stepId }: { stepId: string }) {
  const { runs } = useWorkflowRuns()

  let selectedStep: RunStep | null = null
  for (const run of runs ?? []) {
    const steps = (run.output?.steps ?? run.metadata?.steps ?? []) as RunStep[]
    const found = steps.find((s) => s.id === stepId)
    if (found) {
      selectedStep = found
      break
    }
  }

  if (!selectedStep) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
        Step not found.
      </div>
    )
  }

  const hasNoResult = !selectedStep.error && selectedStep.output === undefined

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <div className="flex items-center gap-2">
        <NodeIcon type={selectedStep.type as NodeType} className="size-6" />
        <h2 className="text-lg font-semibold">{selectedStep.title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-muted-foreground">Status:</span>{" "}
          <span
            className={cn(
              "font-medium capitalize",
              selectedStep.status === "failed" && "text-destructive"
            )}
          >
            {selectedStep.status}
          </span>
        </div>
        {selectedStep.durationMs != null && (
          <div>
            <span className="text-muted-foreground">Duration:</span>{" "}
            <span className="font-medium">
              {prettyMilliseconds(selectedStep.durationMs)}
            </span>
          </div>
        )}
      </div>

      {selectedStep.error && (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-destructive">Error</span>
          <pre className="whitespace-pre-wrap rounded-md bg-destructive/10 p-3 text-xs text-destructive">
            {selectedStep.error}
          </pre>
        </div>
      )}

      {selectedStep.output !== undefined && (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Output</span>
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(selectedStep.output, null, 2)}
          </pre>
        </div>
      )}

      {hasNoResult && selectedStep.status === "done" && (
        <div className="mt-4 text-muted-foreground italic">
          This step completed without producing any output.
        </div>
      )}
      
      {hasNoResult && selectedStep.status !== "done" && selectedStep.status !== "failed" && (
        <div className="mt-4 text-muted-foreground italic">
          This step has not produced any output yet.
        </div>
      )}
    </div>
  )
}
