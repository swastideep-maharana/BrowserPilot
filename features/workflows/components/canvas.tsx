"use client"

import {
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  ConnectionLineType,
  NodeTypes,
} from "@xyflow/react"

import { StepNode } from "@/features/workflows/components/step-node"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"

import { useCallback, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import type { Connection, Edge, Node } from "@xyflow/react"

import "@xyflow/react/dist/style.css"

const nodeTypes: NodeTypes = { step: StepNode }

// ── Initial graph ───────────────────────────────────────────────────────────────

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: { type: "start", kind: "trigger", title: "Start", values: {} },
  },
]

const initialEdges: Edge[] = []

// Returns false on the server and during hydration; true after first paint.
// This keeps the server/client renders identical and avoids hydration mismatches.
function useIsMounted() {
  return useSyncExternalStore(
    () => () => { },
    () => true,
    () => false,
  )
}

// ── Canvas ──────────────────────────────────────────────────────────────────────
// Basic React Flow example: draggable nodes, connectable handles, minimap,
// zoom controls, and a dot-grid background.
export function Canvas() {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTheme()
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  )

  const colorMode = mounted && resolvedTheme === "dark" ? "dark" : "light"

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      colorMode={colorMode}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={{ stroke: "var(--foreground)", strokeWidth: 2 }}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "var(--foreground)", strokeWidth: 2 },
      }}
      maxZoom={1}
    >

      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
