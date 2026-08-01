"use client"

import { useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Workflow } from "lucide-react"

import type { Workflow as WorkflowRow } from "@/lib/db/schema"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface WorkflowNavProps {
  workflows: WorkflowRow[]
  onCreateWorkflow: (name: string) => Promise<void>
}

// ── WorkflowNav ────────────────────────────────────────────────────────────────
// Expanded: full labelled list with a "+" action, no icons on items.
// Collapsed: single Workflow icon button; clicking opens a popover with the list
//            + a "New workflow" button at the top. Popover state is self-managed
//            by the trigger — no useState needed here.
export function WorkflowNav({ workflows, onCreateWorkflow }: WorkflowNavProps) {
  const { state, isMobile } = useSidebar()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const { isPro, redirectToPricing } = useProPlan()

  function handleCreate() {
    if (!isPro) {
      redirectToPricing()
      return
    }

    startTransition(async () => {
      await onCreateWorkflow(generateSlug())
    })
  }

  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton tooltip="Workflows">
                  <Workflow />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="w-56 p-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleCreate} disabled={isPending}>
                      <Plus />
                      <span>{isPending ? "Creating…" : "New workflow"}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <div className="my-1 h-px bg-border" />
                <SidebarMenu>
                  {workflows.map((workflow) => (
                    <SidebarMenuItem key={workflow.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/workflows/${workflow.id}`}
                      >
                        <Link href={`/workflows/${workflow.id}`}>
                          <span className="truncate">{workflow.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupAction
        title="New workflow"
        onClick={handleCreate}
        disabled={isPending}
      >
        <Plus />
        <span className="sr-only">{isPending ? "Creating…" : "New workflow"}</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {workflows.map((workflow) => (
            <SidebarMenuItem key={workflow.id}>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/workflows/${workflow.id}`}
              >
                <Link href={`/workflows/${workflow.id}`}>
                  <span className="truncate">{workflow.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
