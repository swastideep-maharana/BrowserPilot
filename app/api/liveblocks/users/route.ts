import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"

export async function POST(request: Request) {
  // Require an authenticated Clerk session with an active org
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const { userIds } = body as { userIds: string[] }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return Response.json([])
  }

  // Batch-fetch all requested users from the Clerk Backend API
  const client = await clerkClient()
  const { data: clerkUsers } = await client.users.getUserList({
    userId: userIds,
    limit: userIds.length,
  })

  // Build a lookup map so we can return results in the original order
  const userMap = new Map(
    clerkUsers.map((u) => [
      u.id,
      {
        name:
          u.fullName ??
          u.primaryEmailAddress?.emailAddress ??
          u.id,
        avatar: u.imageUrl ?? "",
      },
    ]),
  )

  // Preserve input order; null for any ID Clerk doesn't know about
  const result = userIds.map((id) => userMap.get(id) ?? null)

  return Response.json(result)
}
