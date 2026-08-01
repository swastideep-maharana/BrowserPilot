"use client"

import { useState } from "react"
import { useWorkflowRuns } from "@/features/workflows/components/workflow-runs-provider"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import type { NodeType } from "@/features/workflows/nodes/node-registry"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"
import prettyMilliseconds from "pretty-ms"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { InspectorPanel } from "@/features/workflows/components/inspector-panel"

function LogsPanel({
  selectedStepId,
  onSelectStep,
}: {
  selectedStepId: string | null
  onSelectStep: (id: string | null) => void
}) {
  const { runs } = useWorkflowRuns()

  if (!runs || runs.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground">No runs yet.</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {runs.map((run) => {
        const steps = (run.output?.steps ?? run.metadata?.steps ?? []) as RunStep[]
        return (
          <div key={run.id} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Run {run.id.slice(4, 12)}</h3>
            <div className="flex flex-col gap-1 border-l-2 border-border pl-2">
              {steps.map((step) => {
                const isSelected = selectedStepId === step.id
                return (
                  <button
                    key={step.id}
                    onClick={() => onSelectStep(isSelected ? null : step.id)}
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
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ConsolePanel() {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-card px-3 py-1.5 text-sm font-semibold">
        Console
      </div>
      <div className="min-h-0 flex-1">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={selectedStepId ? 30 : 100} minSize={20} className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <LogsPanel selectedStepId={selectedStepId} onSelectStep={setSelectedStepId} />
            </div>
          </ResizablePanel>
          
          {selectedStepId && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70} minSize={30} className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto border-l border-border bg-muted/30">
                  <InspectorPanel stepId={selectedStepId} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
