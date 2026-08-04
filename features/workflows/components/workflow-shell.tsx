"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ReactFlowProvider } from "@xyflow/react"
import { WorkflowCanvas } from "@/features/workflows/components/workflow-canvas"
import { RightSidebar } from "@/features/workflows/components/right-sidebar"
import { ConsolePanel } from "@/features/workflows/components/console-panel"
import { WorkflowHeader } from "@/features/workflows/components/workflow-header"
import type { WorkflowGraph } from "@/lib/db/schema"

interface WorkflowShellProps {
  workflowId: string
  workflowName: string
  initialGraph?: WorkflowGraph | null
}

// ── WorkflowShell ──────────────────────────────────────────────────────────────
// Top: Navigation & Controls Header (Back, Breadcrumbs, Rename, Run, Live status)
// Body: Horizontal split [Canvas + Console | Handle | Right Inspector]
export function WorkflowShell({
  workflowId,
  workflowName,
  initialGraph,
}: WorkflowShellProps) {
  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-background">
        <WorkflowHeader workflowId={workflowId} initialName={workflowName} />
        
        <div className="min-h-0 flex-1">
          <ResizablePanelGroup
            orientation="horizontal"
            className="size-full"
          >
            {/* ── Left column ───────────────────────────────────── */}
            <ResizablePanel minSize="30rem">
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel minSize="10rem">
                  <WorkflowCanvas initialGraph={initialGraph} />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel
                  defaultSize="16rem"
                  minSize="5rem"
                >
                  <ConsolePanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* ── Right inspector ───────────────────────────────── */}
            <ResizablePanel
              defaultSize="16rem"
              minSize="14rem"
              maxSize="36rem"
            >
              <RightSidebar workflowId={workflowId} />
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

