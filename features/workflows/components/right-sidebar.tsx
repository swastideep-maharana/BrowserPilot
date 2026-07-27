"use client"

import { useState, useTransition } from "react"
import { Play } from "lucide-react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"

import type { helloWorldTask } from "@/trigger/example"
import { runWorkflowAction } from "@/features/workflows/actions"
import { Button } from "@/components/ui/button"

interface RightSidebarProps {
  workflowId: string
}

interface RunHandle {
  runId: string
  publicAccessToken: string
}

// ── RunStatus ──────────────────────────────────────────────────────────────────
// Subscribes to a single run and renders live status + output.
function RunStatus({ runId, publicAccessToken }: RunHandle) {
  const { run, error } = useRealtimeRun<typeof helloWorldTask>(runId, {
    accessToken: publicAccessToken,
    skipColumns: ["payload"],
  })

  if (error) {
    return (
      <p className="text-xs text-destructive">Error: {error.message}</p>
    )
  }

  if (!run) {
    return <p className="text-xs text-muted-foreground">Connecting…</p>
  }

  return (
    <div className="w-full space-y-1 rounded-md border bg-muted/40 p-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">Status</span>
        <span className="font-medium capitalize">{run.status}</span>
      </div>
      {run.output && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Output</span>
          <span className="font-medium">{run.output.message}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">Run ID</span>
        <span className="truncate font-mono text-[10px] text-muted-foreground">
          {run.id}
        </span>
      </div>
    </div>
  )
}

// ── RightSidebar ───────────────────────────────────────────────────────────────
// Inspector panel content. Rendered inside the right ResizablePanel of WorkflowShell.
export function RightSidebar({ workflowId }: RightSidebarProps) {
  const [isPending, startTransition] = useTransition()
  const [handle, setHandle] = useState<RunHandle | null>(null)

  function handleRun() {
    startTransition(async () => {
      const result = await runWorkflowAction(workflowId)
      setHandle(result)
    })
  }

  return (
    <div className="flex size-full flex-col items-start gap-4 p-4">
      <Button onClick={handleRun} disabled={isPending} className="w-full">
        <Play />
        {isPending ? "Starting…" : "RUN"}
      </Button>

      {handle && (
        <RunStatus
          runId={handle.runId}
          publicAccessToken={handle.publicAccessToken}
        />
      )}
    </div>
  )
}
