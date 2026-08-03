"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { HowItWorksDialog } from "@/features/workflows/components/how-it-works-dialog"

export function SidebarGuideButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setOpen(true)}
            tooltip="How it works"
            className="gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <BookOpen className="size-4 text-primary" />
            <span className="truncate font-medium">How it works</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <HowItWorksDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
