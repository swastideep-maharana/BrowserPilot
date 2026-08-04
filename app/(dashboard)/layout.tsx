import { auth } from "@clerk/nextjs/server"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await auth.protect()

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="h-full min-h-0 flex-1 flex flex-col overflow-hidden">
        {/* Mobile-only top bar — opens the sidebar sheet */}
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 md:hidden border-b border-border">
          <SidebarTrigger />
        </header>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

