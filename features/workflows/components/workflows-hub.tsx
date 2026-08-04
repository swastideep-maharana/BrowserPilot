"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  ArrowRight,
  FolderSearch,
  MoreVertical,
  Pencil,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Workflow as WorkflowIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  deleteWorkflowAction,
  renameWorkflowAction,
} from "@/features/workflows/actions"
import { useCreateWorkflow } from "@/features/workflows/hooks/use-create-workflow"
import {
  WORKFLOW_TEMPLATES,
  type WorkflowTemplate,
} from "@/features/workflows/data/templates"
import type { WorkflowGraph } from "@/lib/db/schema"

interface WorkflowItem {
  id: string
  name: string
  orgId: string
  graph: unknown
  createdAt: Date
  updatedAt: Date
}

interface WorkflowsHubProps {
  initialWorkflows: WorkflowItem[]
}

export function WorkflowsHub({ initialWorkflows }: WorkflowsHubProps) {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(initialWorkflows)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowItem | null>(null)
  const [newName, setNewName] = useState("")
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null)
  const [isActionPending, startActionTransition] = useTransition()

  const { createWorkflow, isPending: isCreating } = useCreateWorkflow()

  const filteredWorkflows = workflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  function handleOpenRename(w: WorkflowItem) {
    setEditingWorkflow(w)
    setNewName(w.name)
  }

  function handleSaveRename() {
    if (!editingWorkflow) return
    const trimmed = newName.trim()
    if (!trimmed) {
      toast.error("Workflow name cannot be empty")
      return
    }

    startActionTransition(async () => {
      try {
        const res = await renameWorkflowAction(editingWorkflow.id, trimmed)
        if (res.success) {
          setWorkflows((prev) =>
            prev.map((w) =>
              w.id === editingWorkflow.id ? { ...w, name: trimmed, updatedAt: new Date() } : w
            )
          )
          toast.success("Workflow renamed successfully")
          setEditingWorkflow(null)
        } else {
          toast.error(res.error || "Failed to rename workflow")
        }
      } catch (err) {
        toast.error("Failed to rename workflow")
      }
    })
  }

  function handleDelete(id: string) {
    startActionTransition(async () => {
      try {
        const res = await deleteWorkflowAction(id)
        if (res.success) {
          setWorkflows((prev) => prev.filter((w) => w.id !== id))
          toast.success("Workflow deleted")
          setDeletingWorkflowId(null)
        } else {
          toast.error(res.error || "Failed to delete workflow")
        }
      } catch (err) {
        toast.error("Failed to delete workflow")
      }
    })
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function getNodeCount(graph: unknown) {
    if (!graph || typeof graph !== "object") return 1
    const g = graph as WorkflowGraph
    return g.nodes?.length || 1
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20">
        {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <WorkflowIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Workflows
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Design, execute, and inspect your BrowserPilot browser automation pipelines.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => createWorkflow()}
            disabled={isCreating}
            className="gap-2 font-medium shadow-xs"
          >
            <Plus className="size-4" />
            <span>New Workflow</span>
          </Button>
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows by name..."
            className="pl-9 text-sm"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredWorkflows.length}</span>{" "}
          of {workflows.length} workflows
        </div>
      </div>

      {/* ── Workflows Grid ───────────────────────────────────── */}
      {filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((wf) => {
            const nodeCount = getNodeCount(wf.graph)
            return (
              <div
                key={wf.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/workflows/${wf.id}`}
                      className="flex items-center gap-2.5 font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <WorkflowIcon className="size-4" />
                      </div>
                      <span className="truncate">{wf.name}</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/workflows/${wf.id}`} className="cursor-pointer">
                            <Play className="mr-2 size-4 text-primary" />
                            Open Canvas
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenRename(wf)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 size-4 text-muted-foreground" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingWorkflowId(wf.id)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {nodeCount} {nodeCount === 1 ? "step" : "steps"}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Updated {formatDate(wf.updatedAt || wf.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-[11px] text-muted-foreground">
                    ID: <code className="font-mono">{wf.id.slice(0, 8)}...</code>
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs font-medium text-primary hover:text-primary"
                    asChild
                  >
                    <Link href={`/workflows/${wf.id}`}>
                      <span>Open</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
            <FolderSearch className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {searchQuery ? "No matching workflows found" : "No workflows created yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            {searchQuery
              ? `No workflows found matching "${searchQuery}". Try a different search term.`
              : "Get started by creating a blank workflow or selecting a pre-built starter blueprint."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => createWorkflow()} disabled={isCreating} className="gap-2">
              <Plus className="size-4" />
              <span>Create Blank Workflow</span>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/guide">
                <Sparkles className="mr-2 size-4 text-primary" />
                Browse Blueprints
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── Starter Blueprints Strip ───────────────────────── */}
      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Starter Blueprints</h2>
            <p className="text-xs text-muted-foreground">
              Launch pre-configured browser automation workflows in one click.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" asChild>
            <Link href="/guide">
              <span>View Guide</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WORKFLOW_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon
            return (
              <div
                key={tmpl.id}
                className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex size-7 items-center justify-center rounded-md text-xs font-semibold ${tmpl.iconBg}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-semibold truncate text-foreground">
                      {tmpl.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 h-7 text-xs font-medium w-full"
                  disabled={isCreating}
                  onClick={() => createWorkflow({ template: tmpl })}
                >
                  Use Template
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Rename Dialog ──────────────────────────────────── */}
      <Dialog
        open={Boolean(editingWorkflow)}
        onOpenChange={(open) => !open && setEditingWorkflow(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Workflow</DialogTitle>
            <DialogDescription>
              Enter a new descriptive name for this workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Workflow name..."
              onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
              disabled={isActionPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingWorkflow(null)}
              disabled={isActionPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRename} disabled={isActionPending}>
              Save Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────────────── */}
      <Dialog
        open={Boolean(deletingWorkflowId)}
        onOpenChange={(open) => !open && setDeletingWorkflowId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action is permanent and cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingWorkflowId(null)}
              disabled={isActionPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingWorkflowId && handleDelete(deletingWorkflowId)}
              disabled={isActionPending}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
