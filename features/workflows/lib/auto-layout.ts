import type { Edge } from "@xyflow/react"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"

/**
 * Calculates a clean hierarchical / DAG layout for workflow nodes.
 * Automatically distributes nodes horizontally and centers branch levels vertically,
 * resolving disconnected nodes and multiple branch pipelines.
 */
export function getAutoLayoutedNodes(
  nodes: StepNodeType[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR"
): StepNodeType[] {
  if (nodes.length === 0) return nodes

  // In-degree & outgoing adjacency tracking
  const inDegree = new Map<string, number>()
  const outgoing = new Map<string, string[]>()

  nodes.forEach((n) => {
    inDegree.set(n.id, 0)
    outgoing.set(n.id, [])
  })

  edges.forEach((e) => {
    if (inDegree.has(e.target)) {
      inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1)
    }
    if (outgoing.has(e.source)) {
      outgoing.get(e.source)?.push(e.target)
    }
  })

  // Level assignment (Longest path / rank computation)
  const levels = new Map<string, number>()
  const queue: string[] = []

  // Start with root nodes (0 incoming edges or start node)
  nodes.forEach((n) => {
    if (inDegree.get(n.id) === 0 || n.data?.type === "start") {
      levels.set(n.id, 0)
      queue.push(n.id)
    }
  })

  // Fallback if graph is a cycle or has no pure roots
  if (queue.length === 0 && nodes.length > 0) {
    levels.set(nodes[0].id, 0)
    queue.push(nodes[0].id)
  }

  // BFS / topological rank
  const visited = new Set<string>()
  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const currentLevel = levels.get(currentId) ?? 0
    const neighbors = outgoing.get(currentId) || []

    for (const targetId of neighbors) {
      const existingLevel = levels.get(targetId) ?? -1
      if (currentLevel + 1 > existingLevel) {
        levels.set(targetId, currentLevel + 1)
      }
      queue.push(targetId)
    }
  }

  // Assign level 0 for any unvisited disconnected nodes
  nodes.forEach((n) => {
    if (!levels.has(n.id)) {
      levels.set(n.id, 0)
    }
  })

  // Group nodes by their rank level
  const levelGroups = new Map<number, StepNodeType[]>()
  nodes.forEach((node) => {
    const lvl = levels.get(node.id) ?? 0
    if (!levelGroups.has(lvl)) {
      levelGroups.set(lvl, [])
    }
    levelGroups.get(lvl)!.push(node)
  })

  const HORIZONTAL_SPACING = 320
  const VERTICAL_SPACING = 140
  const START_X = 80
  const START_Y = 160

  return nodes.map((node) => {
    const lvl = levels.get(node.id) ?? 0
    const group = levelGroups.get(lvl) || [node]
    const indexInGroup = group.findIndex((n) => n.id === node.id)
    const countInGroup = group.length

    if (direction === "LR") {
      const x = START_X + lvl * HORIZONTAL_SPACING
      const y = START_Y + (indexInGroup - (countInGroup - 1) / 2) * VERTICAL_SPACING
      return {
        ...node,
        position: { x: Math.round(x), y: Math.round(y) },
      }
    } else {
      const x = START_X + (indexInGroup - (countInGroup - 1) / 2) * HORIZONTAL_SPACING
      const y = START_Y + lvl * VERTICAL_SPACING
      return {
        ...node,
        position: { x: Math.round(x), y: Math.round(y) },
      }
    }
  })
}
