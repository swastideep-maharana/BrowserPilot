import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-start p-6 md:p-10 overflow-y-auto">
      <div className="w-full max-w-5xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Plans &amp; Pricing</h1>
          <p className="text-muted-foreground text-base">
            Choose the right plan for your organization to scale workflows and automation.
          </p>
        </div>
        <div className="flex justify-center">
          <PricingTable for="organization" />
        </div>
      </div>
    </div>
  )
}
