"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="font-semibold text-lg">BrowserPilot</h1>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton showName />
          </Show>
        </div>
      </header>

      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h2 className="font-medium text-base">Project ready with Clerk!</h2>
          <p>You may now start building your authenticated application.</p>
          <p>We&apos;ve configured Clerk auth components in your header.</p>
          <Button
            className="mt-2"
            onClick={() =>
              toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
              })
            }
          >
            Show Toast
          </Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

