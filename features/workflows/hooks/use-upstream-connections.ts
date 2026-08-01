import { useMemo } from "react";
import { useNodes, useEdges, getIncomers } from "@xyflow/react";
import { nodeRegistry } from "@/features/workflows/nodes/node-registry";
import type { StepNodeType, NodeDefinition } from "@/features/workflows/nodes/node-registry";

export type UpstreamOutput = {
    token: string;
    label: string;
    nodeType: string;
};

export function useUpstreamConnections(targetNodeId: string | undefined): UpstreamOutput[] {
    const nodes = useNodes<StepNodeType>();
    const edges = useEdges();

    return useMemo(() => {
        if (!targetNodeId) return [];

        const targetNode = nodes.find(n => n.id === targetNodeId);
        if (!targetNode) return [];

        // Find all ancestors recursively
        const ancestors = new Set<StepNodeType>();
        const queue: StepNodeType[] = [targetNode];

        while (queue.length > 0) {
            const current = queue.shift()!;
            const incomers = getIncomers(current, nodes, edges);
            
            for (const incomer of incomers) {
                if (!ancestors.has(incomer)) {
                    ancestors.add(incomer);
                    queue.push(incomer);
                }
            }
        }

        // Collect outputs from all ancestors
        const outputs: UpstreamOutput[] = [];
        for (const ancestor of ancestors) {
            const def = nodeRegistry[ancestor.data.type] as NodeDefinition | undefined;
            if (def && def.outputs) {
                for (const output of def.outputs) {
                    outputs.push({
                        token: `{{ ${ancestor.id}.${output.path} }}`,
                        label: `${ancestor.data.title || def.label} · ${output.label}`,
                        nodeType: ancestor.data.type,
                    });
                }
            }
        }

        return outputs;
    }, [targetNodeId, nodes, edges]);
}
