import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { WorkflowCanvas } from "@/features/workflows/components/workflow-canvas"
import { RightSidebar } from "@/features/workflows/components/right-sidebar"

interface WorkflowShellProps {
  workflowId: string
}

// ── WorkflowShell ──────────────────────────────────────────────────────────────
// Horizontal split: [Left column | Handle | Right inspector]
// Left column is itself a vertical split: [Canvas | Handle | Logs]
// react-resizable-panels v4: sizes are CSS strings — "Xrem" is interpreted as rem.
export function WorkflowShell({ workflowId }: WorkflowShellProps) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="size-full"
    >
      {/* ── Left column ───────────────────────────────────── */}
      <ResizablePanel minSize="30rem">
        <WorkflowCanvas />
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
  )
}
