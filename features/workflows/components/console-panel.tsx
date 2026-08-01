"use client"

import { useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { InspectorPanel } from "@/features/workflows/components/inspector-panel"
import { LogsPanel } from "@/features/workflows/components/logs-panel"

export type ConsoleSelection = 
  | { type: "step"; stepId: string }
  | { type: "replay"; runId: string; sessionId: string }
  | null

export function ConsolePanel() {
  const [selection, setSelection] = useState<ConsoleSelection>(null)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-card px-3 py-1.5 text-sm font-semibold">
        Console
      </div>
      <div className="min-h-0 flex-1">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={selection ? 30 : 100} minSize={20} className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <LogsPanel selection={selection} onSelect={setSelection} />
            </div>
          </ResizablePanel>
          
          {selection && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70} minSize={30} className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto border-l border-border bg-muted/30">
                  <InspectorPanel selection={selection} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
