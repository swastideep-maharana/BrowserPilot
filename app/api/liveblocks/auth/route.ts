import { auth, currentUser } from "@clerk/nextjs/server"
import { liveblocks } from "@/lib/liveblocks"

export async function POST(request: Request) {
  // Require an authenticated Clerk session
  const { userId, orgId } = await auth()

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Fetch the full Clerk user so we can populate userInfo
  const user = await currentUser()

  const { status, body } = await liveblocks.identifyUser(
    {
      userId,

      // Map the active Clerk org to a Liveblocks group so that rooms whose
      // groupsAccesses include the orgId will be accessible to this user.
      groupIds: orgId ? [orgId] : [],
      organizationId: orgId || undefined,
    },
    {
      userInfo: {
        name:
          user?.fullName ??
          user?.primaryEmailAddress?.emailAddress ??
          userId,
        avatar: user?.imageUrl ?? "",
      },
    },
  )

  return new Response(body, { status })
}
