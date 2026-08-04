"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Workflow,
  Plus,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Video,
  Bot,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCreateWorkflow } from "@/features/workflows/hooks/use-create-workflow"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import { HowItWorksDialog } from "@/features/workflows/components/how-it-works-dialog"
import {
  TemplateCards,
  type WorkflowTemplate,
} from "@/features/workflows/components/template-cards"

export default function DashboardPage() {
  const { createWorkflow, isPending } = useCreateWorkflow()
  const { isPro } = useProPlan()
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideTab, setGuideTab] = useState("get-started")

  function handleSelectTemplate(tmpl: WorkflowTemplate) {
    createWorkflow({ template: tmpl })
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
                  <Badge
                    variant="outline"
                    className="text-[11px] gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                  >
                    <ShieldCheck className="size-3" />
                    <span>Pro Active</span>
                  </Badge>
                )}
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Automate Any Web Task with BrowserPilot
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                Build visual workflows that navigate websites, extract structured data, click and
                type with natural language, and run autonomous browser agents in cloud sessions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                size="lg"
                className="gap-2 px-6 text-sm font-semibold rounded-xl shadow-xs"
                disabled={isPending}
                onClick={() => createWorkflow()}
              >
                <Plus className="size-4" />
                <span>{isPending ? "Creating…" : "New Workflow"}</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2 px-5 text-sm font-medium rounded-xl"
                asChild
              >
                <Link href="/guide">
                  <BookOpen className="size-4 text-primary" />
                  <span>Guide & Docs</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── WORKFLOW STARTER RECIPES ───────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Starter Workflow Blueprints
              </h2>
              <p className="text-xs text-muted-foreground">
                Click any template to quickly create a pre-configured automation flow with connected nodes.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/guide?tab=recipes">
                <span>Explore all blueprints</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <TemplateCards
            onSelectTemplate={handleSelectTemplate}
            onOpenGuide={handleOpenGuide}
          />
        </div>

        {/* ── CORE CAPABILITIES HIGHLIGHTS ───────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Platform Architecture & Quick Links
              </h2>
              <p className="text-xs text-muted-foreground">
                Everything under the hood designed for speed, resilience, and visibility.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-primary hover:text-primary"
              asChild
            >
              <Link href="/workflows">
                <span>All Workflows</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/guide?tab=nodes"
              className="rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                Natural Language Actions
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Use <code>Act</code> and <code>Extract</code> with natural language prompts without
                maintaining fragile XPath or CSS selectors.
              </p>
            </Link>

            <Link
              href="/guide?tab=observability"
              className="rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Video className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                Browserbase Video Replay
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Review full HLS video recordings of cloud browser sessions directly inside your
                workflow console.
              </p>
            </Link>

            <Link
              href="/workflows"
              className="rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-card group"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Layers className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                Workflows Management Hub
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Search, filter, manage, rename, and monitor all organization browser automation pipelines.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Quick Guide Dialog */}
      <HowItWorksDialog
        open={guideOpen}
        onOpenChange={setGuideOpen}
        defaultTab={guideTab}
      />
    </div>
  )
}
