import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

const isSessionTaskRoute = createRouteMatcher(['/session-tasks/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { sessionStatus } = await auth()

  // When "Membership Required" is enabled, a signed-in user with no org
  // gets sessionStatus='pending'. Redirect them to choose-organization
  // unless they're already on a session task page.
  if (sessionStatus === 'pending' && !isSessionTaskRoute(req)) {
    return NextResponse.redirect(
      new URL('/session-tasks/choose-organization', req.url),
    )
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|fontawesome|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
}
