"use client"

import {
  Controls,
  MiniMap,
  ReactFlow,
  ConnectionLineType,
  NodeTypes,
  Panel,
  useReactFlow,
  type Edge,
  type NodeChange,
} from "@xyflow/react"
import { Maximize2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { StepNode } from "@/features/workflows/components/step-node"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"
import { getAutoLayoutedNodes } from "@/features/workflows/lib/auto-layout"
import { Button } from "@/components/ui/button"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import type { WorkflowGraph } from "@/lib/db/schema"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes: NodeTypes = { step: StepNode }

// ── Default fallback graph ───────────────────────────────────────────────────────
const defaultInitialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 50, y: 150 },
    data: { type: "start", kind: "trigger", title: "Start", values: {} },
  },
]

const defaultInitialEdges: Edge[] = []

// Returns false on the server and during hydration; true after first paint.
// This keeps the server/client renders identical and avoids hydration mismatches.
function useIsMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false,
  )
}

// ── Canvas Top-Left Toolbar ──────────────────────────────────────────────────────
function CanvasToolbar({
  onNodesChange,
}: {
  onNodesChange: (changes: NodeChange<StepNodeType>[]) => void
}) {
  const { fitView, getNodes, getEdges } = useReactFlow<StepNodeType>()

  const handleAutoLayout = () => {
    const currentNodes = getNodes()
    const currentEdges = getEdges()
    if (currentNodes.length === 0) return

    const layoutedNodes = getAutoLayoutedNodes(currentNodes, currentEdges)
    const changes: NodeChange<StepNodeType>[] = layoutedNodes.map((n) => ({
      id: n.id,
      type: "position",
      position: n.position,
    }))

    onNodesChange(changes)
    toast.success("Workflow auto-aligned", {
      description: "Nodes organized into a structured pipeline view.",
    })

    setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 })
    }, 50)
  }

  return (
    <Panel position="top-left" className="m-3 flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleAutoLayout}
        className="h-8 gap-1.5 rounded-lg border-border/80 bg-background/90 px-3 text-xs font-medium backdrop-blur-md shadow-xs hover:bg-accent hover:text-foreground cursor-pointer transition-all active:scale-95"
        title="Auto-organize nodes into a clean visual pipeline"
      >
        <Sparkles className="size-3.5 text-primary" />
        <span>Auto Layout</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => fitView({ padding: 0.25, duration: 400 })}
        className="h-8 gap-1.5 rounded-lg border-border/80 bg-background/90 px-2.5 text-xs font-medium backdrop-blur-md shadow-xs hover:bg-accent hover:text-foreground cursor-pointer transition-all active:scale-95"
        title="Fit entire workflow into view"
      >
        <Maximize2 className="size-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Fit View</span>
      </Button>
    </Panel>
  )
}

// ── Canvas ──────────────────────────────────────────────────────────────────────
export function Canvas({ initialGraph }: { initialGraph?: WorkflowGraph | null }) {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  const initialNodes =
    initialGraph?.nodes && initialGraph.nodes.length > 0
      ? initialGraph.nodes
      : defaultInitialNodes
  const initialEdges = initialGraph?.edges ?? defaultInitialEdges

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow({
    suspense: true,
    nodes: { initial: initialNodes },
    edges: { initial: initialEdges },
  })

  const colorMode = mounted && resolvedTheme === "dark" ? "dark" : "light"

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      fitView
      colorMode={colorMode}
      proOptions={{ hideAttribution: true }}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={{ stroke: "var(--foreground)", strokeWidth: 2 }}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "var(--foreground)", strokeWidth: 2 },
      }}
      maxZoom={1}
    >
      <CanvasToolbar onNodesChange={onNodesChange} />
      <Controls />
      <Cursors />
      <MiniMap />
    </ReactFlow>
  )
}
