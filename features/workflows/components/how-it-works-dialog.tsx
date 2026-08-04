"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle2,
  Layers,
  Braces,
  ArrowRight,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { nodeRegistry } from "@/features/workflows/nodes/node-registry"
import { WORKFLOW_TEMPLATES } from "@/features/workflows/data/templates"

interface HowItWorksDialogProps {
  trigger?: React.ReactNode
  defaultTab?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function HowItWorksDialog({
  trigger,
  defaultTab = "get-started",
  open,
  onOpenChange,
}: HowItWorksDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <BookOpen className="size-3.5 text-primary" />
            <span>Guide</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-[92vw] h-[620px] max-h-[85vh] flex flex-col p-6 sm:p-7 overflow-hidden rounded-2xl">
        {/* ── Fixed Header ────────────────────────────────────────── */}
        <DialogHeader className="shrink-0 flex flex-row items-center justify-between pb-3.5 border-b border-border pr-8">
          <div className="space-y-0.5">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground">
              <BookOpen className="size-5 text-primary" />
              <span>BrowserPilot Quick Reference</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Stagehand V3 visual canvas, node pipeline architecture, and session replays.
            </DialogDescription>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs shrink-0" asChild>
            <Link href="/guide" target="_blank">
              <span>Full Hub</span>
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </DialogHeader>

        {/* ── Tabs Container ──────────────────────────────────────── */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col min-h-0 mt-3.5 overflow-hidden"
        >
          <TabsList className="shrink-0 grid grid-cols-4 w-full h-10 p-1 bg-muted/60 rounded-lg">
            <TabsTrigger value="get-started" className="gap-1.5 text-xs py-1.5 data-[state=active]:bg-background">
              <Zap className="size-3.5 text-amber-500" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="nodes" className="gap-1.5 text-xs py-1.5 data-[state=active]:bg-background">
              <Layers className="size-3.5 text-blue-500" />
              <span>Nodes</span>
            </TabsTrigger>
            <TabsTrigger value="tokens" className="gap-1.5 text-xs py-1.5 data-[state=active]:bg-background">
              <Braces className="size-3.5 text-purple-500" />
              <span>Piping</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="gap-1.5 text-xs py-1.5 data-[state=active]:bg-background">
              <Sparkles className="size-3.5 text-emerald-500" />
              <span>Blueprints</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Overview ───────────────────────────────────── */}
          <TabsContent
            value="get-started"
            className="flex-1 min-h-0 overflow-y-auto mt-3.5 pr-2 space-y-3.5 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/60 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex size-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 font-bold text-[11px]">
                    1
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm">Drag & Connect Nodes</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Connect from the <strong>Start</strong> trigger to action steps. Edges dictate execution order and data flow.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex size-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-500 font-bold text-[11px]">
                    2
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm">Natural Language AI</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Stagehand V3 interprets instructions like <em>&quot;Click sign in&quot;</em> without brittle CSS/XPath selectors.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex size-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-[11px]">
                    3
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm">Cloud Execution</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Workflows run in isolated Trigger.dev tasks, streaming live step updates back to the canvas.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex size-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 font-bold text-[11px]">
                    4
                  </div>
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm">Video Replays</h4>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Browserbase captures the full browser session video and console traces for visual replay.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" />
                <span>Prompting Best Practice</span>
              </p>
              Keep <strong>Act</strong> instructions atomic (single action). Use <strong>Agent</strong> for complex, multi-step web exploration.
            </div>
          </TabsContent>

          {/* ── Tab 2: Nodes ──────────────────────────────────────── */}
          <TabsContent
            value="nodes"
            className="flex-1 min-h-0 overflow-y-auto mt-3.5 pr-2 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              {Object.entries(nodeRegistry).map(([type, def]) => {
                const Icon = def.icon
                return (
                  <div
                    key={type}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card/60 p-3.5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`flex size-6 items-center justify-center rounded-md ${def.accent}`}>
                          <Icon className="size-3.5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm text-foreground">{def.label}</span>
                        <Badge variant="outline" className="ml-auto text-[10px] capitalize py-0 h-4">
                          {def.kind}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{def.description}</p>
                    </div>

                    {"outputs" in def && def.outputs && def.outputs.length > 0 && (
                      <div className="mt-2.5 border-t border-border/50 pt-2 flex flex-wrap gap-1">
                        {def.outputs.map((out) => (
                          <Badge key={out.path} variant="secondary" className="font-mono text-[9px] py-0 h-4">
                            {out.path}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* ── Tab 3: Piping ─────────────────────────────────────── */}
          <TabsContent
            value="tokens"
            className="flex-1 min-h-0 overflow-y-auto mt-3.5 pr-2 space-y-3 focus-visible:outline-none"
          >
            <div className="rounded-xl border border-border bg-card/60 p-4 text-xs shadow-xs space-y-3">
              <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                Variable Interpolation Syntax
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Inject outputs from preceding nodes into downstream input fields using double-curly brackets:
              </p>
              <div className="rounded-md bg-muted/80 p-2.5 font-mono text-xs text-foreground border border-border">
                {"{{nodeId.outputKey}}"}
              </div>
              <div className="space-y-1.5 text-muted-foreground pt-1">
                <p>• Extract text output: <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">{"{{extract-1.extraction}}"}</code></p>
                <p>• Agent summary output: <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">{"{{agent-1.message}}"}</code></p>
                <p>• Open URL title output: <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">{"{{open-url-1.title}}"}</code></p>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab 4: Blueprints ─────────────────────────────────── */}
          <TabsContent
            value="recipes"
            className="flex-1 min-h-0 overflow-y-auto mt-3.5 pr-2 space-y-3 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WORKFLOW_TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon
                return (
                  <div
                    key={tmpl.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card/60 p-3.5 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`flex size-6 items-center justify-center rounded-md text-xs ${tmpl.iconBg}`}>
                          <Icon className="size-3.5" />
                        </div>
                        <span className="font-semibold text-foreground text-xs sm:text-sm truncate">{tmpl.title}</span>
                        <Badge variant="secondary" className="ml-auto text-[9px] py-0 h-4">
                          {tmpl.tag}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
                        {tmpl.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                        {tmpl.steps.map((s, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <span className="font-medium text-foreground">{s}</span>
                            {idx < tmpl.steps.length - 1 && <span>→</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end pt-1 pb-1">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
                <Link href="/guide?tab=recipes">
                  <span>Explore full blueprint details in Hub</span>
                  <ArrowRight className="size-3" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
