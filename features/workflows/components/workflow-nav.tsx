"use client"

import { Plus, Workflow } from "lucide-react"

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

const DUMMY_WORKFLOWS = [
  "dominant-wasp",
  "honest-reindeer",
  "expected-llama",
  "essential-ocelot",
  "creepy-echidna",
  "eastern-silkworm",
  "cultural-lion",
  "proud-weasel",
  "regional-bonobo",
]

// ── WorkflowNav ────────────────────────────────────────────────────────────────
// Expanded: full labelled list with a "+" action, no icons on items.
// Collapsed: single Workflow icon button; clicking opens a popover with the list
//            + a "New workflow" button at the top. Popover state is self-managed
//            by the trigger — no useState needed here.
export function WorkflowNav() {
  const { state, isMobile } = useSidebar()

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
                    <SidebarMenuButton>
                      <Plus />
                      <span>New workflow</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <div className="my-1 h-px bg-border" />
                <SidebarMenu>
                  {DUMMY_WORKFLOWS.map((workflow, index) => (
                    <SidebarMenuItem key={workflow}>
                      <SidebarMenuButton isActive={index === 0}>
                        <span className="truncate">{workflow}</span>
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
      <SidebarGroupAction title="New workflow">
        <Plus />
        <span className="sr-only">New workflow</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {DUMMY_WORKFLOWS.map((workflow, index) => (
            <SidebarMenuItem key={workflow}>
              <SidebarMenuButton isActive={index === 0}>
                <span className="truncate">{workflow}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
