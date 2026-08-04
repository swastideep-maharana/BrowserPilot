"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Braces,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Play,
  Search,
  Sparkles,
  Tv,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { nodeRegistry } from "@/features/workflows/nodes/node-registry"
import { WORKFLOW_TEMPLATES } from "@/features/workflows/data/templates"
import { useCreateWorkflow } from "@/features/workflows/hooks/use-create-workflow"

interface GuideViewProps {
  initialTab?: string
}

export function GuideView({ initialTab = "get-started" }: GuideViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { createWorkflow, isPending } = useCreateWorkflow()

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex flex-col gap-6 p-6 lg:p-10 max-w-6xl mx-auto w-full pb-20">
        {/* ── Header with Back Button ───────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-2">
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Knowledge & Guide Hub
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Everything you need to master BrowserPilot browser automation, node pipelines, token piping, and cloud sessions.
              </p>
            </div>
          </div>

          <Button onClick={() => createWorkflow()} disabled={isPending} className="gap-2 shrink-0">
            <Sparkles className="size-4" />
            <span>Create Workflow</span>
          </Button>
        </div>
      </div>

      {/* ── Main Navigation Tabs ──────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto p-1 bg-muted/60 rounded-xl gap-1 border border-border/40">
          <TabsTrigger value="get-started" className="gap-2 py-2 text-xs font-medium rounded-lg">
            <Zap className="size-3.5 text-amber-500" />
            <span>Getting Started</span>
          </TabsTrigger>
          <TabsTrigger value="nodes" className="gap-2 py-2 text-xs font-medium rounded-lg">
            <Layers className="size-3.5 text-blue-500" />
            <span>Node Catalog</span>
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-2 py-2 text-xs font-medium rounded-lg">
            <Braces className="size-3.5 text-purple-500" />
            <span>Tokens & Piping</span>
          </TabsTrigger>
          <TabsTrigger value="recipes" className="gap-2 py-2 text-xs font-medium rounded-lg">
            <Sparkles className="size-3.5 text-emerald-500" />
            <span>Blueprints</span>
          </TabsTrigger>
          <TabsTrigger value="observability" className="gap-2 py-2 text-xs font-medium rounded-lg col-span-2 md:col-span-1">
            <Tv className="size-3.5 text-rose-500" />
            <span>Observability</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Getting Started ────────────────────────────── */}
        <TabsContent value="get-started" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 font-bold text-sm">
                  1
                </div>
                <h3 className="font-semibold text-foreground text-base">Visual Canvas Design</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Assemble multi-step browser automation pipelines by dragging and connecting nodes. Workflows always initiate from the <strong>Start</strong> trigger and flow smoothly through action steps.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 font-bold text-sm">
                  2
                </div>
                <h3 className="font-semibold text-foreground text-base">Stagehand V3 AI Engine</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike fragile CSS/XPath selectors, Stagehand uses LLMs to autonomously identify DOM elements, handle dynamic content, and execute natural language browser commands (Act, Extract, Observe, Agent).
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-sm">
                  3
                </div>
                <h3 className="font-semibold text-foreground text-base">Realtime Multiplayer & Cloud Runs</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by Liveblocks and Trigger.dev. Workflows execute securely in isolated background task workers, streaming live step updates and node progress back to the canvas in real time.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 font-bold text-sm">
                  4
                </div>
                <h3 className="font-semibold text-foreground text-base">Full Browserbase Observability</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every remote browser session is recorded and proxied through Browserbase. Inspect live screenshots, interactive video replay playlists, and console logs directly within the workflow inspector.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Best Practices for Prompting Nodes</span>
            </h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-muted-foreground list-disc pl-5">
              <li><strong>Act Nodes:</strong> Keep instructions atomic and specific (e.g. <em>&quot;Click the sign in button&quot;</em> or <em>&quot;Type &apos;hello&apos; into the search field&quot;</em>). Avoid combining multi-step flows in a single Act node.</li>
              <li><strong>Extract Nodes:</strong> Specify the exact fields you want extracted from the page (e.g. <em>&quot;Extract the product price, stock status, and seller name&quot;</em>).</li>
              <li><strong>Agent Nodes (CUA):</strong> Best for complex, non-deterministic tasks requiring multiple autonomous navigations, search engine lookups, or decision making.</li>
            </ul>
          </div>
        </TabsContent>

        {/* ── Tab 2: Node Catalog ───────────────────────────────── */}
        <TabsContent value="nodes" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(nodeRegistry).map(([type, def]) => {
              const Icon = def.icon
              const isTrigger = def.kind === "trigger"
              return (
                <div
                  key={type}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/30"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg ${def.accent}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">
                            {def.label}
                          </h4>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            type: {type}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant={isTrigger ? "secondary" : "outline"}
                        className="text-[11px] capitalize"
                      >
                        {def.kind}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {def.description}
                    </p>

                    {/* Input Fields */}
                    {def.fields.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[11px] font-semibold text-foreground">
                          Inputs:
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {def.fields.map((f) => (
                            <span
                              key={f.key}
                              className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                            >
                              {f.label} ({f.key})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Outputs */}
                  {"outputs" in def && def.outputs && def.outputs.length > 0 && (
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <span className="text-[11px] font-semibold text-foreground">
                        Downstream Outputs:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {def.outputs.map((out) => (
                          <Badge
                            key={out.path}
                            variant="secondary"
                            className="font-mono text-[10px] font-normal"
                          >
                            {out.path}: {out.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* ── Tab 3: Tokens & Piping ────────────────────────────── */}
        <TabsContent value="tokens" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="font-semibold text-foreground text-base mb-2">
              Variable Interpolation Syntax
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Pass data seamlessly between connected workflow steps. Any node output can be referenced in downstream inputs using double-curly brackets:
            </p>

            <div className="rounded-lg bg-muted/80 p-3 font-mono text-xs text-foreground border border-border">
              {"{{nodeId.outputKey}}"}
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-sm text-foreground">Examples in Action:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <span className="text-xs font-semibold text-primary block mb-1">
                    Email Subject Piping
                  </span>
                  <p className="text-xs font-mono text-muted-foreground">
                    &quot;Weekly Report for {"{{extract-1.extraction}}"}&quot;
                  </p>
                  <span className="text-[11px] text-muted-foreground mt-2 block">
                    Injects the string extracted by the node with ID <code>extract-1</code>.
                  </span>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <span className="text-xs font-semibold text-primary block mb-1">
                    AI Summary Piping
                  </span>
                  <p className="text-xs font-mono text-muted-foreground">
                    &quot;Here are the findings:\n{"{{agent-search.message}}"}&quot;
                  </p>
                  <span className="text-[11px] text-muted-foreground mt-2 block">
                    Injects the final response message from the Stagehand Agent node.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 4: Blueprints ─────────────────────────────────── */}
        <TabsContent value="recipes" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKFLOW_TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon
              return (
                <div
                  key={tmpl.id}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex size-9 items-center justify-center rounded-lg text-sm font-semibold ${tmpl.iconBg}`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-base">
                            {tmpl.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">{tmpl.tag}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                      {tmpl.details}
                    </p>

                    <div className="rounded-lg bg-muted/40 p-3 border border-border/60 mb-4">
                      <span className="text-[11px] font-semibold text-foreground block mb-2">
                        Pipeline Nodes:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {tmpl.steps.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="rounded-md bg-card border border-border px-2 py-0.5 text-xs font-medium text-foreground">
                              {s}
                            </span>
                            {idx < tmpl.steps.length - 1 && (
                              <span className="text-xs text-muted-foreground">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => createWorkflow({ template: tmpl })}
                    disabled={isPending}
                    className="w-full gap-2 font-medium"
                  >
                    <Sparkles className="size-4" />
                    <span>Use Blueprint</span>
                  </Button>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* ── Tab 5: Observability ──────────────────────────────── */}
        <TabsContent value="observability" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h3 className="font-semibold text-foreground text-base mb-2">
              Browserbase Session Observability
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              BrowserPilot connects directly to the Browserbase SDK for cloud session telemetry, live DOM debugging, and video replays:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex size-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-500 mb-3">
                  <Tv className="size-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">HLS Video Replays</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Full session recording playlists streamed on-demand to watch the automated browser in action.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 mb-3">
                  <Eye className="size-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">Live View</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time interactive session mirroring for live debugging and manual intervention.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex size-8 items-center justify-center rounded-md bg-purple-500/10 text-purple-500 mb-3">
                  <Code2 className="size-4" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">Console Logs</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Step-by-step stdout, Stagehand reasoning traces, and API payload logs.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
