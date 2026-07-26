import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// ── AppSidebar ─────────────────────────────────────────────────────────────────
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">

      {/* ── Header ──────────────────────────────────────── */}
      <SidebarHeader className="h-14 flex-row items-center gap-0 overflow-hidden px-2">
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
                organizationPreviewTextContainer: "overflow-hidden min-w-0 flex-1",
                organizationName: "sr-only",
                organizationSwitcherTriggerIcon: "shrink-0 ml-auto",
              },
            }}
          />
        </div>
        <SidebarTrigger className="shrink-0" />
      </SidebarHeader>

      {/* ── Content ─────────────────────────────────────── */}
      <SidebarContent>
        <WorkflowNav />
      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────── */}
      <SidebarFooter className="h-14 flex-row items-center px-3">
        <UserButton />
      </SidebarFooter>

    </Sidebar>
  )
}
