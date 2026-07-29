"use client"

import {
  Controls,
  MiniMap,
  ReactFlow,
  ConnectionLineType,
  NodeTypes,
  Panel,
} from "@xyflow/react"

import { StepNode } from "@/features/workflows/components/step-node"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"
import { AvatarStack } from "@liveblocks/react-ui"
import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import type { Edge } from "@xyflow/react"

import "@xyflow/react/dist/style.css"

import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
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
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={{ stroke: "var(--foreground)", strokeWidth: 2 }}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { stroke: "var(--foreground)", strokeWidth: 2 },
      }}
      maxZoom={1}
    >

      <Controls />
      <Cursors />
      <Panel position="top-right">
        <AvatarStack />
      </Panel>
      <MiniMap />
    </ReactFlow>
  )
}
