"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Workflow,
  Plus,
  BookOpen,
  Sparkles,
  Bot,
  Video,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createWorkflowAction } from "@/features/workflows/actions"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import { HowItWorksDialog } from "@/features/workflows/components/how-it-works-dialog"
import {
  TemplateCards,
  type WorkflowTemplate,
} from "@/features/workflows/components/template-cards"

export default function Page() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { isPro, redirectToPricing } = useProPlan()
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideTab, setGuideTab] = useState("get-started")

  function handleCreate(name?: string) {
    if (!isPro) {
      redirectToPricing()
      return
    }

    startTransition(async () => {
      try {
        const res = await createWorkflowAction(name || generateSlug())
        if (res?.success) {
          router.push(`/workflows/${res.workflowId}`)
        } else if (res?.redirectTo) {
          router.push(res.redirectTo)
        } else if (res && !res.success) {
          toast.error(res.error || "Failed to create workflow")
        }
      } catch (error) {
        console.error("Error creating workflow:", error)
        toast.error("Failed to create workflow")
      }
    })
  }

  function handleSelectTemplate(tmpl: WorkflowTemplate) {
    handleCreate(`${tmpl.id}-${generateSlug().slice(0, 6)}`)
  }

  function handleOpenGuide(tab: string = "get-started") {
    setGuideTab(tab)
    setGuideOpen(true)
  }

  return (
    <div className="min-h-full flex-1 overflow-y-auto bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* ── HERO BANNER ────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/80 to-muted/20 p-8 shadow-xs">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary border-primary/20"
                >
                  <Sparkles className="size-3.5" />
                  <span>AI-Powered Browser Automation</span>
                </Badge>
                {isPro && (
                  <Badge variant="outline" className="text-[11px] gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                    <ShieldCheck className="size-3" />
                    <span>Pro Active</span>
                  </Badge>
                )}
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Automate Any Web Task with Stagehand AI
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Build visual workflows that navigate websites, extract structured data, click and type with natural language, and run autonomous browser agents in cloud sessions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                size="lg"
                className="gap-2 px-6 text-sm font-semibold rounded-xl shadow-xs"
                disabled={isPending}
                onClick={() => handleCreate()}
              >
                <Plus className="size-4" />
                <span>{isPending ? "Creating…" : "New Workflow"}</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-5 text-sm font-medium rounded-xl"
                onClick={() => handleOpenGuide("get-started")}
              >
                <BookOpen className="size-4 text-primary" />
                <span>How It Works</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ── WORKFLOW STARTER RECIPES ───────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Starter Workflow Blueprints
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any template to quickly create a pre-configured automation flow.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenGuide("recipes")}
            >
              <span>Explore all recipes</span>
              <ArrowRight className="size-3" />
            </Button>
          </div>

          <TemplateCards
            onSelectTemplate={handleSelectTemplate}
            onOpenGuide={handleOpenGuide}
          />
        </div>

        {/* ── CORE CAPABILITIES HIGHLIGHTS ───────────────────────── */}
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              Platform Features & Architecture
            </h2>
            <p className="text-xs text-muted-foreground">
              Everything under the hood designed for speed, resilience, and visibility.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="cursor-pointer rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              onClick={() => handleOpenGuide("nodes")}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Natural Language Actions</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Use <code>Act</code> and <code>Extract</code> with natural language prompts without maintaining fragile XPath or CSS selectors.
              </p>
            </div>

            <div
              className="cursor-pointer rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              onClick={() => handleOpenGuide("observability")}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Video className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Browserbase Video Replay</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Review full HLS video recordings of cloud browser sessions directly inside your workflow console.
              </p>
            </div>

            <div
              className="cursor-pointer rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              onClick={() => handleOpenGuide("get-started")}
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Layers className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm">Live Multiplayer Sync</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Collaborate in real time with organization teammates using Liveblocks room state synchronization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Guide Dialog */}
      <HowItWorksDialog
        open={guideOpen}
        onOpenChange={setGuideOpen}
        defaultTab={guideTab}
      />
    </div>
  )
}


