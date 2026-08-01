"use client"

import { nodeRegistry, type NodeType } from "@/features/workflows/nodes/node-registry"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function NodeIcon({ type, className, running }: { type: NodeType; className?: string; running?: boolean }) {
  const def = nodeRegistry[type]
  const Icon = def.icon
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md",
        def.accent,
        className
      )}
    >
      {running ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Icon className="size-3.5" />
      )}
    </span>
  )
}
