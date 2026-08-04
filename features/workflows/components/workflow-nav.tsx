"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Layers,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react"
import { toast } from "sonner"

import type { Workflow as WorkflowRow } from "@/lib/db/schema"
import { useCreateWorkflow } from "@/features/workflows/hooks/use-create-workflow"
import {
  renameWorkflowAction,
  deleteWorkflowAction,
} from "@/features/workflows/actions"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface WorkflowNavProps {
  workflows: WorkflowRow[]
}

const PRIMARY_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/workflows", label: "All Workflows", icon: Workflow, exact: true },
  { href: "/guide", label: "Guide & Docs", icon: BookOpen },
  { href: "/pricing", label: "Plans & Pricing", icon: CreditCard },
]

export function WorkflowNav({ workflows }: WorkflowNavProps) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { createWorkflow, isPending: isCreatePending } = useCreateWorkflow()

  const [renamingWorkflow, setRenamingWorkflow] = useState<WorkflowRow | null>(null)
  const [newName, setNewName] = useState("")
  const [deletingWorkflow, setDeletingWorkflow] = useState<WorkflowRow | null>(null)
  const [isActionPending, startActionTransition] = useTransition()

  const isCollapsed = state === "collapsed" && !isMobile

  function handleOpenRename(workflow: WorkflowRow) {
    setRenamingWorkflow(workflow)
    setNewName(workflow.name)
  }

  function handleSaveRename() {
    if (!renamingWorkflow) return
    const trimmed = newName.trim()
    if (!trimmed) {
      toast.error("Workflow name cannot be empty")
      return
    }

    startActionTransition(async () => {
      try {
        const res = await renameWorkflowAction(renamingWorkflow.id, trimmed)
        if (res.success) {
          toast.success("Workflow renamed successfully")
          setRenamingWorkflow(null)
          router.refresh()
        } else {
          toast.error(res.error || "Failed to rename workflow")
        }
      } catch {
        toast.error("Failed to rename workflow")
      }
    })
  }

  function handleConfirmDelete() {
    if (!deletingWorkflow) return
    const targetId = deletingWorkflow.id
    startActionTransition(async () => {
      try {
        const res = await deleteWorkflowAction(targetId)
        if (res.success) {
          toast.success("Workflow deleted")
          setDeletingWorkflow(null)
          if (pathname === `/workflows/${targetId}`) {
            router.push("/workflows")
          } else {
            router.refresh()
          }
        } else {
          toast.error(res.error || "Failed to delete workflow")
        }
      } catch {
        toast.error("Failed to delete workflow")
      }
    })
  }

  if (isCollapsed) {
    return (
      <>
        <SidebarGroup>
          <SidebarMenu>
            {PRIMARY_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href)
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={link.label}
                  >
                    <Link href={link.href}>
                      <Icon />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}

            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton tooltip="Workflows List">
                    <Workflow />
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="w-60 p-1">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => createWorkflow()}
                        disabled={isCreatePending}
                      >
                        <Plus />
                        <span>{isCreatePending ? "Creating…" : "New workflow"}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                  <div className="my-1 h-px bg-border" />
                  <SidebarMenu>
                    {workflows.slice(0, 8).map((workflow) => (
                      <SidebarMenuItem key={workflow.id} className="group/item relative">
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/workflows/${workflow.id}`}
                        >
                          <Link href={`/workflows/${workflow.id}`} className="pr-6">
                            <span className="truncate">{workflow.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              showOnHover
                              title="Workflow options"
                              className="hover:bg-sidebar-accent"
                            >
                              <MoreHorizontal className="size-3.5" />
                              <span className="sr-only">Workflow options</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" className="w-36">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenRename(workflow)
                              }}
                              className="cursor-pointer"
                            >
                              <Pencil className="size-3.5 mr-2" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingWorkflow(workflow)
                              }}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="size-3.5 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))}
                    {workflows.length > 8 && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-xs text-primary">
                          <Link href="/workflows">
                            <span>View all ({workflows.length})</span>
                            <ArrowRight className="size-3 ml-auto" />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Rename Dialog */}
        <Dialog
          open={!!renamingWorkflow}
          onOpenChange={(open) => !open && setRenamingWorkflow(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename Workflow</DialogTitle>
              <DialogDescription>
                Enter a new name for your workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="py-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSaveRename()
                  }
                }}
                placeholder="Workflow name"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRenamingWorkflow(null)}
                disabled={isActionPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRename} disabled={isActionPending}>
                {isActionPending && (
                  <Loader2 className="size-3.5 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={!!deletingWorkflow}
          onOpenChange={(open) => !open && setDeletingWorkflow(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{deletingWorkflow?.name}&rdquo;?
                This action cannot be undone and will permanently remove this workflow and its nodes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isActionPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  handleConfirmDelete()
                }}
                disabled={isActionPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isActionPending ? (
                  <Loader2 className="size-3.5 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5 mr-2" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  const displayedWorkflows = workflows.slice(0, 8)

  return (
    <>
      {/* ── Primary Navigation ─────────────────────────────────── */}
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {PRIMARY_LINKS.map((link) => {
              const Icon = link.icon
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href)
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                  >
                    <Link href={link.href}>
                      <Icon className="size-4" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ── Recent Workflows ───────────────────────────────────── */}
      <SidebarGroup>
        <SidebarGroupLabel>Workflows</SidebarGroupLabel>
        <SidebarGroupAction
          title="New workflow"
          onClick={() => createWorkflow()}
          disabled={isCreatePending}
        >
          <Plus />
          <span className="sr-only">{isCreatePending ? "Creating…" : "New workflow"}</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {displayedWorkflows.map((workflow) => (
              <SidebarMenuItem key={workflow.id} className="group/item relative">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/workflows/${workflow.id}`}
                >
                  <Link href={`/workflows/${workflow.id}`} className="pr-6">
                    <span className="truncate">{workflow.name}</span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      title="Workflow options"
                      className="hover:bg-sidebar-accent"
                    >
                      <MoreHorizontal className="size-3.5" />
                      <span className="sr-only">Workflow options</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-36">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenRename(workflow)
                      }}
                      className="cursor-pointer"
                    >
                      <Pencil className="size-3.5 mr-2" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingWorkflow(workflow)
                      }}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-3.5 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}

            {workflows.length === 0 && (
              <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                No workflows yet.
              </div>
            )}

            {workflows.length > 8 && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-xs text-primary font-medium">
                  <Link href="/workflows">
                    <span>View all ({workflows.length})</span>
                    <ArrowRight className="size-3 ml-auto" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Rename Dialog */}
      <Dialog
        open={!!renamingWorkflow}
        onOpenChange={(open) => !open && setRenamingWorkflow(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Workflow</DialogTitle>
            <DialogDescription>
              Enter a new name for your workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSaveRename()
                }
              }}
              placeholder="Workflow name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenamingWorkflow(null)}
              disabled={isActionPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRename} disabled={isActionPending}>
              {isActionPending && (
                <Loader2 className="size-3.5 mr-2 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deletingWorkflow}
        onOpenChange={(open) => !open && setDeletingWorkflow(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletingWorkflow?.name}&rdquo;?
              This action cannot be undone and will permanently remove this workflow and its nodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              disabled={isActionPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isActionPending ? (
                <Loader2 className="size-3.5 mr-2 animate-spin" />
              ) : (
                <Trash2 className="size-3.5 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
