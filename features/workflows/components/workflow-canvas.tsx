"use client"

import { Canvas } from "@/features/workflows/components/canvas"
import type { WorkflowGraph } from "@/lib/db/schema"

// ── WorkflowCanvas ─────────────────────────────────────────────────────────────
export function WorkflowCanvas({ initialGraph }: { initialGraph?: WorkflowGraph | null }) {
  return (
    <div className="relative h-full w-full">
      <Canvas initialGraph={initialGraph} />
    </div>
  )
}


