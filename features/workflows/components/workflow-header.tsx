"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Check,
  Loader2,
  MoreHorizontal,
  Pencil,
  Play,
  Square,
  Sparkles,
  Cloud,
  Trash2,
} from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  cancelWorkflowRunAction,
  deleteWorkflowAction,
  renameWorkflowAction,
  runWorkflowAction,
  saveWorkflowAction,
} from "@/features/workflows/actions"
import { validateGraph } from "@/features/workflows/lib/validate-graph"
import { useWorkflowRuns } from "@/features/workflows/components/workflow-runs-provider"
import { AvatarStack } from "@liveblocks/react-ui"
import { HowItWorksDialog } from "@/features/workflows/components/how-it-works-dialog"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"
import type { WorkflowGraph } from "@/lib/db/schema"

interface WorkflowHeaderProps {
  workflowId: string
  initialName: string
}

export function WorkflowHeader({ workflowId, initialName }: WorkflowHeaderProps) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(initialName)
  const [isSavingName, startNameTransition] = useTransition()
  const [isRunningPending, startRunTransition] = useTransition()
  const [isDeletingPending, startDeleteTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const { getNodes, getEdges } = useReactFlow()
  const { runs, isLive } = useWorkflowRuns()

  useEffect(() => {
    setName(initialName)
    setEditValue(initialName)
  }, [initialName])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const liveRun = isLive
    ? runs?.find(
        (r) =>
          !["COMPLETED", "FAILED", "CANCELED", "SYSTEM_FAILURE", "CRASHED"].includes(
            r.status
          )
      ) || runs[0]
    : undefined

  function handleSaveName() {
    const trimmed = editValue.trim()
    if (!trimmed || trimmed === name) {
      setIsEditing(false)
      setEditValue(name)
      return
    }

    const previousName = name
    setName(trimmed)
    setIsEditing(false)

    startNameTransition(async () => {
      try {
        const res = await renameWorkflowAction(workflowId, trimmed)
        if (res?.success) {
          toast.success("Workflow renamed")
        } else {
          setName(previousName)
          setEditValue(previousName)
          toast.error(res?.error || "Failed to rename workflow")
        }
      } catch (err) {
        setName(previousName)
        setEditValue(previousName)
        toast.error("Failed to rename workflow")
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSaveName()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(name)
    }
  }

  function handleRun() {
    const graph: WorkflowGraph = {
      nodes: getNodes() as StepNodeType[],
      edges: getEdges(),
    }
    const problems = validateGraph(graph)
    if (problems.length > 0) {
      toast.error(problems[0])
      return
    }

    startRunTransition(async () => {
      try {
        await saveWorkflowAction({ id: workflowId, graph })
        await runWorkflowAction(workflowId)
        toast.success("Workflow run started")
      } catch (error) {
        toast.error("Failed to start workflow run")
      }
    })
  }

  function handleStop() {
    if (!liveRun) return
    startRunTransition(async () => {
      try {
        await cancelWorkflowRunAction(liveRun.id)
        toast.success("Workflow run cancelled")
      } catch (error) {
        toast.error("Failed to stop workflow run")
      }
    })
  }

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-border bg-card/70 px-3 md:px-4 backdrop-blur-xs">
      {/* ── Left Navigation & Title ────────────────────────── */}
      <div className="flex min-w-0 items-center gap-1.5 md:gap-2.5">
        <SidebarTrigger className="size-8 text-muted-foreground hover:text-foreground shrink-0" title="Toggle Sidebar (Ctrl+B)" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/workflows" title="Back to All Workflows">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline font-medium">Workflows</span>
          </Link>
        </Button>

        <span className="text-border/80">/</span>

        {/* Inline editable name */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveName}
              className="h-7 w-44 sm:w-64 text-xs font-semibold"
              disabled={isSavingName}
            />
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-emerald-500 hover:text-emerald-600"
              onClick={handleSaveName}
            >
              <Check className="size-3.5" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex max-w-[200px] sm:max-w-[340px] items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors"
            title="Click to rename workflow"
          >
            <span className="truncate">{name}</span>
            <Pencil className="size-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}

        {/* Sync & Live Status */}
        {isLive ? (
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] text-blue-500 animate-pulse"
          >
            <Loader2 className="size-3 animate-spin" />
            <span>Executing</span>
          </Badge>
        ) : (
          <div className="hidden items-center gap-1 text-[11px] text-muted-foreground md:flex">
            <Cloud className="size-3.5 text-emerald-500" />
            <span className="text-muted-foreground/80">Live Synced</span>
          </div>
        )}
      </div>

      {/* ── Right Actions ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Liveblocks Avatar Stack */}
        <div className="hidden sm:block">
          <AvatarStack />
        </div>

        {/* Quick Guide Dialog */}
        <HowItWorksDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground hidden md:flex"
            >
              <BookOpen className="size-3.5 text-primary" />
              <span>Guide</span>
            </Button>
          }
        />

        {/* More Options Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground hover:text-foreground"
              disabled={isDeletingPending}
              title="More workflow options"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem
              variant="destructive"
              className="text-xs cursor-pointer"
              disabled={isDeletingPending}
              onSelect={(e) => {
                e.preventDefault()
                startDeleteTransition(async () => {
                  try {
                    const res = await deleteWorkflowAction(workflowId)
                    if (res?.success) {
                      toast.success("Workflow deleted")
                      router.push("/workflows")
                    } else {
                      toast.error(res?.error || "Failed to delete workflow")
                    }
                  } catch (error) {
                    toast.error("Failed to delete workflow")
                  }
                })
              }}
            >
              <Trash2 className="size-3.5 mr-1.5" />
              <span>Delete workflow</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Run / Stop Button */}
        {isLive && liveRun ? (
          <Button
            size="sm"
            variant="destructive"
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
            disabled={isRunningPending}
            onClick={handleStop}
          >
            <Square className="size-3.5 fill-current" />
            <span>Stop</span>
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
            disabled={isRunningPending}
            onClick={handleRun}
          >
            <Play className="size-3.5 fill-current" />
            <span>Run</span>
          </Button>
        )}
      </div>
    </header>
  )
}
