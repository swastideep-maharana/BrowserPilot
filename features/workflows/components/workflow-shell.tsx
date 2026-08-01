import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ReactFlowProvider } from "@xyflow/react"
import { WorkflowCanvas } from "@/features/workflows/components/workflow-canvas"
import { RightSidebar } from "@/features/workflows/components/right-sidebar"
import { ConsolePanel } from "@/features/workflows/components/console-panel"

interface WorkflowShellProps {
  workflowId: string
}

// ── WorkflowShell ──────────────────────────────────────────────────────────────
// Horizontal split: [Left column | Handle | Right inspector]
// Left column is itself a vertical split: [Canvas | Handle | Logs]
// react-resizable-panels v4: sizes are CSS strings — "Xrem" is interpreted as rem.
export function WorkflowShell({ workflowId }: WorkflowShellProps) {
  return (
    // ReactFlowProvider sits above both Canvas and RightSidebar so they share
    // one React Flow store — required for useReactFlow() in the sidebar.
    <ReactFlowProvider>
      <ResizablePanelGroup
        orientation="horizontal"
        className="size-full"
      >
        {/* ── Left column ───────────────────────────────────── */}
        <ResizablePanel minSize="30rem">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel minSize="10rem">
              <WorkflowCanvas />
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
    </ReactFlowProvider>
  )
}
