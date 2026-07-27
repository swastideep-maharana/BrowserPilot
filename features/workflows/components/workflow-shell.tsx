import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
        <ResizablePanelGroup orientation="vertical">

          {/* Canvas */}
          <ResizablePanel
            minSize="18rem"
            className="flex items-center justify-center text-xs text-muted-foreground"
          >
            Canvas
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Logs */}
          <ResizablePanel
            defaultSize="8rem"
            minSize="6rem"
            className="flex items-center justify-center text-xs text-muted-foreground"
          >
            Logs
          </ResizablePanel>

        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* ── Right inspector ───────────────────────────────── */}
      <ResizablePanel
        defaultSize="16rem"
        minSize="14rem"
        maxSize="36rem"
        className="flex items-center justify-center text-xs text-muted-foreground"
      >
        Inspector
      </ResizablePanel>

    </ResizablePanelGroup>
  )
}
