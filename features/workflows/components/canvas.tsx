"use client"

import {

  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  ConnectionLineType,
} from "@xyflow/react"
import { useCallback, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import type { Connection, Edge, Node } from "@xyflow/react"

import "@xyflow/react/dist/style.css"

// ── Initial graph ───────────────────────────────────────────────────────────────
const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 120 },
    data: { label: "Start" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 340, y: 120 },
    data: { label: "Step" },
  },
  {
    id: "3",
    position: { x: 580, y: 120 },
    data: { label: "End" },
    type: "output",
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
]

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
