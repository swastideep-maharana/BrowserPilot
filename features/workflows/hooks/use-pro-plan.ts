"use client"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useProPlan() {
  const { has, isLoaded, orgId } = useAuth()
  const router = useRouter()

  const isPro = Boolean(
    isLoaded && orgId && (has?.({ plan: "pro" }) || has?.({ plan: "org:pro" }))
  )

  const redirectToPricing = useCallback(() => {
    router.push("/pricing")
  }, [router])

  return {
    isPro,
    isLoading: !isLoaded,
    isLoaded,
    orgId,
    redirectToPricing,
    upgrade: redirectToPricing,
    navigateToPricing: redirectToPricing,
  }
}
