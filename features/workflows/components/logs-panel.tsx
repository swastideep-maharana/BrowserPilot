"use client"

import { useWorkflowRuns } from "@/features/workflows/components/workflow-runs-provider"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import type { NodeType } from "@/features/workflows/nodes/node-registry"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"
import prettyMilliseconds from "pretty-ms"
import { cn } from "@/lib/utils"
import { Video } from "lucide-react"
import { ConsoleSelection } from "@/features/workflows/components/console-panel"

export function LogsPanel({
  selection,
  onSelect,
}: {
  selection: ConsoleSelection
  onSelect: (selection: ConsoleSelection) => void
}) {
  const { runs } = useWorkflowRuns()

  if (!runs || runs.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No runs yet.</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {runs.map((run) => {
        const steps = (run.output?.steps ?? run.metadata?.steps ?? []) as RunStep[]
        
        // The sessionId is only present in the final output when the run finishes.
        const sessionId = run.sessionId as string | undefined

        return (
          <div key={run.id} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Run {run.id.slice(4, 12)}</h3>
            <div className="flex flex-col gap-1 border-l-2 border-border pl-2">
              {steps.map((step) => {
                const isSelected = selection?.type === "step" && selection.stepId === step.id
                return (
                  <button
                    key={step.id}
                    onClick={() => onSelect(isSelected ? null : { type: "step", stepId: step.id })}
                    className={cn(
                      "flex items-center gap-2 rounded-md p-2 text-left transition-colors",
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted",
                      step.status === "failed" &&
                        "bg-destructive/10 text-destructive hover:bg-destructive/20",
                      step.status === "pending" && "opacity-50"
                    )}
                  >
                    <NodeIcon type={step.type as NodeType} className="size-5" running={step.status === "running"} />
                    <span className="flex-1 text-sm font-medium">{step.title}</span>
                    {step.durationMs != null && (
                      <span className="text-xs text-muted-foreground">
                        {prettyMilliseconds(step.durationMs)}
                      </span>
                    )}
                  </button>
                )
              })}

              {sessionId && (
                <button
                  key={`${run.id}-replay`}
                  onClick={() => {
                    const isSelected = selection?.type === "replay" && selection.runId === run.id
                    onSelect(isSelected ? null : { type: "replay", runId: run.id, sessionId })
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-md p-2 text-left transition-colors mt-2",
                    selection?.type === "replay" && selection.runId === run.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-500">
                    <Video className="size-3.5" />
                  </span>
                  <span className="flex-1 text-sm font-medium">Session Replay</span>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
