import { SignIn, Show, UserButton } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Show when="signed-out">
        <SignIn routing="hash" />
      </Show>
      <Show when="signed-in">
        <UserButton showName />
      </Show>
    </div>
  )
}
