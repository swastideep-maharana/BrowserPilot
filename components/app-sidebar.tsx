"use client"

import { Plus, Workflow } from "lucide-react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
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

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">

      {/* ── Header ─────────────────────────────────────── */}
      <SidebarHeader className="h-14 flex-row items-center gap-0 overflow-hidden px-2">

        {/* Org switcher — hides to nothing when icon-collapsed */}
        <div className="min-w-0 flex-1 overflow-hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:flex-none transition-all duration-200">
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            appearance={{
              elements: {
                rootBox: "w-full overflow-hidden",
                organizationSwitcherTrigger:
                  "w-full justify-start gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent transition-colors overflow-hidden",
                organizationPreviewTextContainer:
                  "overflow-hidden min-w-0 flex-1",
                organizationName: "sr-only",
                organizationSwitcherTriggerIcon: "shrink-0 ml-auto",
              },
            }}
          />
        </div>

        {/* Collapse / expand toggle */}
        <SidebarTrigger className="shrink-0" />
      </SidebarHeader>

      {/* ── Content ────────────────────────────────────── */}
      <SidebarContent>
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
                  <SidebarMenuButton isActive={index === 0} tooltip={workflow}>
                    <Workflow className="shrink-0" />
                    <span className="truncate">{workflow}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────── */}
      <SidebarFooter className="h-14 flex-row items-center px-3">
        <UserButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
