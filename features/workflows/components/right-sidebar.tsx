"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Lock, MoreHorizontal, Play, Square, Trash2 } from "lucide-react"
import { useReactFlow, useStore } from "@xyflow/react"
import { toast } from "sonner"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import {
  cancelWorkflowRunAction,
  deleteWorkflowAction,
  runWorkflowAction,
} from "@/features/workflows/actions"
import { validateGraph } from "@/features/workflows/lib/validate-graph"
import { useUpstreamConnections } from "@/features/workflows/hooks/use-upstream-connections"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import { useWorkflowRuns } from "@/features/workflows/components/workflow-runs-provider"
import { HowItWorksDialog } from "@/features/workflows/components/how-it-works-dialog"

import {
  nodeRegistry,
  type NodeDefinition,
  type NodeField,
  type NodeType,
  type StepNodeKind,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"
import { NodeIcon } from "@/features/workflows/components/node-icon"

// This file builds up to the RightSidebar component exported at the bottom: a
// header with workflow actions (delete, run), then two tabs — a Toolbar for
// adding nodes and an Editor for tweaking the selected node. Each helper below is
// defined just above the block that uses it.

// ---------------------------------------------------------------------------
// Shared pieces — used by both the Toolbar and the Editor.
// ---------------------------------------------------------------------------

// A titled, scrollable panel. Each tab renders its content inside one.
function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-y border-border bg-card px-3 py-1.5 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Editor tab — edits the fields of the selected node.
// ---------------------------------------------------------------------------

// A single editor field for a node property.
function FieldInput({
  field,
  value,
  onChange,
  onFocus,
}: {
  field: NodeField
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
}) {
  if (field.multiline) {
    return (
      <Textarea
        id={field.key}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="min-h-[8rem] resize-y"
      />
    )
  }

  return (
    <Input
      id={field.key}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
    />
  )
}

// The Editor tab: one input per field on the selected node, or an empty state.
function Inspector({ node }: { node: StepNodeType | undefined }) {
  const { updateNodeData } = useReactFlow<StepNodeType>()
  const [lastEditedField, setLastEditedField] = useState<string | undefined>()
  const upstreamOutputs = useUpstreamConnections(node?.id)

  if (!node) {
    return (
      <Section title="Editor">
        <p className="p-3 text-sm text-muted-foreground">No node selected</p>
      </Section>
    )
  }

  const { type, title, values } = node.data
  const def: NodeDefinition = nodeRegistry[type]

  const handleInsertToken = (token: string) => {
    const fieldKey = lastEditedField || (def.fields.length > 0 ? def.fields[0].key : undefined)
    if (!fieldKey) return

    const currentValue = values[fieldKey] || ""
    const newValue = currentValue + (currentValue && !currentValue.endsWith(" ") ? " " : "") + token
    
    updateNodeData(node.id, {
      values: { ...values, [fieldKey]: newValue },
    })
  }

  return (
    <Section title={title} icon={<NodeIcon type={type} />}>
      <div className="flex flex-col gap-3 p-3">
        {def.fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">No properties</p>
        ) : (
          def.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={field.key} className="text-xs">
                {field.label}
              </Label>
              <FieldInput
                field={field}
                value={values[field.key] ?? ""}
                onChange={(value) => {
                  updateNodeData(node.id, {
                    values: { ...values, [field.key]: value },
                  })
                }}
                onFocus={() => setLastEditedField(field.key)}
              />
            </div>
          ))
        )}

        {upstreamOutputs.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
            <Label className="text-xs font-semibold">Connections</Label>
            <div className="flex flex-wrap gap-2">
              {upstreamOutputs.map((output, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertToken(output.token)}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 py-1 text-xs hover:bg-muted"
                >
                  <NodeIcon type={output.nodeType as NodeType} className="size-4 rounded-[4px]" />
                  <span>{output.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Toolbar tab — adds nodes to the canvas, grouped by kind.
// ---------------------------------------------------------------------------

// The Toolbar's groups, one accordion section per node kind.
const sections: { kind: StepNodeKind; label: string }[] = [
  { kind: "trigger", label: "Triggers" },
  { kind: "action", label: "Actions" },
]

// Every node type from the registry, filtered into the groups below.
const definitions = Object.values(nodeRegistry)

// The Toolbar tab: a button per node type that adds it to the canvas.
function Palette() {
  const { addNodes, getNodes, getViewport } = useReactFlow()
  const { isPro, redirectToPricing } = useProPlan()

  const add = (type: NodeType) => {
    if (type === "agent" && !isPro) {
      redirectToPricing()
      return
    }

    const def = nodeRegistry[type]
    const existingNodes = getNodes()

    // ── Trigger guard: only one trigger node is allowed ─────────────────────
    if (def.kind === "trigger") {
      const hasTrigger = existingNodes.some((n) => {
        const data = (n as StepNodeType).data
        return data?.kind === "trigger"
      })
      if (hasTrigger) {
        toast.error("Only one trigger node is allowed per workflow.", {
          description: "Remove the existing trigger before adding another.",
        })
        return
      }
    }

    // ── Number nodes of the same type (e.g. "Open URL 2") ───────────────────
    const sameTypeCount = existingNodes.filter(
      (n) => (n as StepNodeType).data?.type === type
    ).length
    const label =
      sameTypeCount === 0
        ? def.label
        : `${def.label} ${sameTypeCount + 1}`

    // ── Place in the centre of the current viewport ──────────────────────────
    // getViewport() → { x, y, zoom } — these are the pan/zoom values.
    // The canvas element fills its container; we need to convert from screen
    // centre back to flow coordinates:
    //   flowX = (screenX - panX) / zoom
    // We use window dimensions as a proxy for the canvas centre.
    const { x: panX, y: panY, zoom } = getViewport()
    const canvasEl = document.querySelector(".react-flow") as HTMLElement | null
    const rect = canvasEl?.getBoundingClientRect()
    const canvasCx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const canvasCy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    const flowX = (canvasCx - panX) / zoom
    const flowY = (canvasCy - panY) / zoom

    const newNode: StepNodeType = {
      id: crypto.randomUUID(),
      type: "step",
      position: { x: flowX, y: flowY },
      data: {
        type,
        kind: def.kind,
        title: label,
        values: {},
      },
    }

    addNodes(newNode)
  }

  return (
    <Section title="Toolbar">
      <Accordion
        type="multiple"
        defaultValue={sections.map((s) => s.kind)}
        className="px-3 py-2"
      >
        {sections.map((section) => (
          <AccordionItem
            key={section.kind}
            value={section.kind}
            className="not-last:border-b-0"
          >
            <AccordionTrigger className="py-2 text-xs font-medium text-muted-foreground hover:no-underline">
              {section.label}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5">
              {definitions
                .filter((def) => def.kind === section.kind)
                .map((def) => {
                  const isLocked = def.type === "agent" && !isPro
                  return (
                    <Button
                      key={def.type}
                      variant="ghost"
                      onClick={() => {
                        if (isLocked) {
                          redirectToPricing()
                          return
                        }
                        add(def.type as NodeType)
                      }}
                      className="justify-start gap-2.5 px-1.5 text-xs w-full"
                    >
                      <NodeIcon type={def.type as NodeType} />
                      <span className="flex-1 text-left">{def.label}</span>
                      {isLocked && (
                        <Lock className="size-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  )
                })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Header — workflow-level actions shown above the tabs.
// ---------------------------------------------------------------------------

// The "..." menu for workflow-level actions.
function ActionsMenu({ workflowId }: { workflowId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" disabled={isPending}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        <DropdownMenuItem
          variant="destructive"
          className="text-xs [&_svg:not([class*='size-'])]:size-3.5"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault()
            startTransition(async () => {
              try {
                const res = await deleteWorkflowAction(workflowId)
                if (res?.success) {
                  toast.success("Workflow deleted")
                  router.push("/")
                } else {
                  toast.error(res?.error || "Failed to delete workflow")
                }
              } catch (error) {
                console.error("Failed to delete workflow:", error)
                toast.error("Failed to delete workflow")
              }
            })
          }}
        >
          <Trash2 />
          Delete workflow
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Kicks off a run of the current workflow or cancels an in-flight run.
function RunButton({ workflowId }: { workflowId: string }) {
  const { getNodes, getEdges } = useReactFlow<StepNodeType>()
  const [isPending, startTransition] = useTransition()
  const { runs, isLive } = useWorkflowRuns()

  const liveRun = isLive
    ? runs.find(
        (r) =>
          !["COMPLETED", "FAILED", "CANCELED", "SYSTEM_FAILURE", "CRASHED"].includes(
            r.status
          )
      ) || runs[0]
    : undefined

  if (isLive && liveRun) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await cancelWorkflowRunAction(liveRun.id)
              toast.success("Workflow run stopped")
            } catch (error) {
              toast.error("Failed to stop workflow run")
            }
          })
        }}
      >
        <Square fill="primary" />
        Stop
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={isPending}
      onClick={() => {
        const graph = { nodes: getNodes(), edges: getEdges() }
        const problems = validateGraph(graph)
        if (problems.length > 0) {
          toast.error(problems[0])
          return
        }

        startTransition(async () => {
          try {
            await runWorkflowAction(workflowId)
          } catch (error) {
            toast.error("Failed to start workflow run")
          }
        })
      }}
    >
      <Play fill="primary" />
      Run
    </Button>
  )
}

// ---------------------------------------------------------------------------
// The sidebar itself — header on top, then the Toolbar / Editor tabs.
// ---------------------------------------------------------------------------

interface RightSidebarProps {
  workflowId: string
}

export function RightSidebar({ workflowId: _workflowId }: RightSidebarProps) {
  const [tab, setTab] = useState("toolbar")

  // Read the selected node from the shared React Flow store.
  const selected = useStore((s) => s.nodes.find((n) => n.selected)) as StepNodeType | undefined

  // TODO: auto-switch to the Editor tab when the selection changes.
  const [prevSelectedId, setPrevSelectedId] = useState(selected?.id)
  if (selected && selected.id !== prevSelectedId) {
    setPrevSelectedId(selected.id)
    setTab("editor")
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <Tabs value={tab} onValueChange={setTab} className="size-full gap-0">
        <div className="flex items-center justify-between border-b border-border p-2">
          <div className="flex items-center gap-1">
            <ActionsMenu workflowId={_workflowId} />
            <HowItWorksDialog
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  title="Workflow Guide & Documentation"
                >
                  <BookOpen className="size-4" />
                </Button>
              }
            />
          </div>
          <RunButton workflowId={_workflowId} />
        </div>
        <TabsList className="m-2 w-fit bg-background">
          <TabsTrigger
            value="toolbar"
            className="flex-none rounded-sm data-active:bg-accent! data-active:text-accent-foreground! data-active:shadow-none! dark:data-active:border-transparent!"
          >
            Toolbar
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="flex-none rounded-sm data-active:bg-accent! data-active:text-accent-foreground! data-active:shadow-none! dark:data-active:border-transparent!"
          >
            Editor
          </TabsTrigger>
        </TabsList>
        <TabsContent value="toolbar" className="flex min-h-0 flex-col">
          <Palette />
        </TabsContent>
        <TabsContent value="editor" className="flex min-h-0 flex-col">
          <Inspector node={selected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}