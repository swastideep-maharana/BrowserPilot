import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { OrganizationSwitcher } from "@clerk/nextjs"

import { listWorkflows } from "@/features/workflows/data"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import { SidebarUserButton } from "@/components/sidebar-user-button"
import { LogoIcon } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// ── AppSidebar ─────────────────────────────────────────────────────────────────
export async function AppSidebar() {
  const { orgId } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []

  return (
    <Sidebar collapsible="icon" variant="inset">

      {/* ── Header ──────────────────────────────────────── */}
      <SidebarHeader className="p-2 border-b border-sidebar-border/40 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-b-0">
        {/* Expanded Header */}
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-2 px-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-sidebar-accent/50 transition-colors"
              title="BrowserPilot"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-card border border-border shadow-xs shrink-0 p-1">
                <LogoIcon className="size-6" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                BrowserPilot
              </span>
            </Link>
            <SidebarTrigger
              className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
              title="Collapse Sidebar"
            />
          </div>

          <div className="min-w-0 overflow-hidden pt-0.5">
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/"
              afterSelectOrganizationUrl="/"
              afterLeaveOrganizationUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full overflow-hidden",
                  organizationSwitcherTrigger:
                    "w-full justify-start gap-2 px-2 py-1.5 rounded-md hover:bg-sidebar-accent transition-colors overflow-hidden text-xs border border-sidebar-border/50 bg-sidebar-accent/15",
                  organizationPreviewTextContainer: "overflow-hidden min-w-0 flex-1",
                  organizationName: "font-medium text-xs truncate",
                  organizationSwitcherTriggerIcon: "shrink-0 ml-auto text-muted-foreground",
                },
              }}
            />
          </div>
        </div>

        {/* Collapsed Header (Centered Logo + Sidebar Toggle) */}
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:py-0.5">
          <Link
            href="/"
            className="flex size-9 items-center justify-center rounded-xl bg-card hover:bg-muted/80 border border-border shadow-xs hover:border-primary/50 transition-all hover:scale-105 p-1"
            title="BrowserPilot - Home"
          >
            <LogoIcon className="size-6" />
          </Link>

          <SidebarTrigger
            className="size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            title="Expand Sidebar (Ctrl+B)"
          />
        </div>
      </SidebarHeader>

      {/* ── Content ─────────────────────────────────────── */}
      <SidebarContent>
        <WorkflowNav workflows={workflows} />
      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────── */}
      <SidebarFooter className="p-2 border-t border-sidebar-border/40 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:border-t-0">
        <SidebarUserButton />
      </SidebarFooter>

      {/* ── Drag / Click Rail to Expand / Collapse ─────── */}
      <SidebarRail />

    </Sidebar>
  )
}
