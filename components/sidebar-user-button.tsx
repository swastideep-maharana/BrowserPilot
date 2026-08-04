"use client"

import { UserButton, useUser, useClerk } from "@clerk/nextjs"
import { useSidebar } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"

export function SidebarUserButton() {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-1.5 w-full py-0.5">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8 ring-1 ring-border/50",
            },
          }}
        />
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="size-3.5" />
          <span className="sr-only">Sign out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center gap-1.5 rounded-lg p-1 hover:bg-sidebar-accent text-sidebar-foreground transition-colors group border border-transparent hover:border-border/50">
      <button
        type="button"
        onClick={() => openUserProfile()}
        className="flex flex-1 min-w-0 items-center gap-2.5 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-0.5"
        title="Manage account"
      >
        <div className="shrink-0 pointer-events-none">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8 ring-1 ring-border/50",
              },
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground truncate">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Account"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {user?.primaryEmailAddress?.emailAddress || "Manage account"}
          </p>
        </div>
      </button>

      {/* Direct Log out action button */}
      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/sign-in" })}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        title="Sign out"
      >
        <LogOut className="size-3.5" />
        <span className="sr-only">Sign out</span>
      </button>
    </div>
  )
}
