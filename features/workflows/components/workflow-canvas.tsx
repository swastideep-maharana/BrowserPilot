import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Canvas } from "@/features/workflows/components/canvas"

// ── WorkflowCanvas ─────────────────────────────────────────────────────────────
// Vertical split: [Canvas | Handle | Logs]
export function WorkflowCanvas() {
  return (
    <ResizablePanelGroup orientation="vertical">

      {/* Canvas */}
      <ResizablePanel minSize="18rem">
        <Canvas />
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
  )
}
