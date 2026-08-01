import { auth } from "@clerk/nextjs/server"
import { Browserbase } from "@browserbasehq/sdk"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { orgId, userId } = await auth()
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Await params since it's a Promise in newer Next.js versions
  const { sessionId } = await params

  const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  })

  try {
    const replay = await bb.sessions.replays.retrieve(sessionId)
    return NextResponse.json(replay)
  } catch (error: any) {
    // If it's a 400 or 404, the replay might not be ready yet.
    if (error.status === 400 || error.status === 404) {
      return NextResponse.json({ status: "not-ready" }, { status: 202 })
    }
    
    console.error("Failed to retrieve replay", error)
    return new NextResponse("Error retrieving replay", { status: 500 })
  }
}
