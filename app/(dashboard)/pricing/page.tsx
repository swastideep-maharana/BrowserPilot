import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { PricingTable } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col p-6 md:p-10 overflow-y-auto max-w-5xl mx-auto w-full">
      {/* ── Back Navigation & Breadcrumb ───────────────────────── */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      <div className="w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
            <Sparkles className="size-3.5" />
            <span>Upgrade Organization</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Plans &amp; Pricing
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Unlock unlimited BrowserPilot AI browser automation workflows, autonomous agents, and Browserbase video replays.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <PricingTable for="organization" />
        </div>
      </div>
    </div>
  )
}
