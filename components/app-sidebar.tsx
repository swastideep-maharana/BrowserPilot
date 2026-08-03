import { auth } from "@clerk/nextjs/server"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

import { createWorkflowAction } from "@/features/workflows/actions"
import { listWorkflows } from "@/features/workflows/data"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"
import { SidebarGuideButton } from "@/components/sidebar-guide-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// ── AppSidebar ─────────────────────────────────────────────────────────────────
export async function AppSidebar() {
  const { orgId } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []

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
        <WorkflowNav workflows={workflows} onCreateWorkflow={createWorkflowAction} />
      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────── */}
      <SidebarFooter className="flex-col gap-2 p-2">
        <SidebarGuideButton />
        <div className="flex h-10 items-center justify-between px-1">
          <UserButton />
        </div>
      </SidebarFooter>

    </Sidebar>
  )
}
