import { SignIn, Show, UserButton, OrganizationSwitcher } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Show when="signed-out">
        <SignIn routing="hash" />
      </Show>
      <Show when="signed-in">
        <div className="flex flex-col items-center gap-4">
          <UserButton showName />
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
          />
        </div>
      </Show>
    </div>
  )
}
