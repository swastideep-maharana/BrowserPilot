import { TaskChooseOrganization } from "@clerk/nextjs"

export const metadata = {
  title: "Choose Organization | BrowserPilot",
  description: "Select or create an organization to continue.",
}

export default function ChooseOrganizationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <TaskChooseOrganization redirectUrlComplete="/" />
    </main>
  )
}
