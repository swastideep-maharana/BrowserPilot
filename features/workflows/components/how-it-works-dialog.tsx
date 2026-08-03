"use client"

import { useState } from "react"
import {
  BookOpen,
  Sparkles,
  Globe,
  MousePointerClick,
  Search,
  Eye,
  Bot,
  Mail,
  Video,
  ArrowRight,
  Zap,
  CheckCircle2,
  Code2,
  Workflow,
  HelpCircle,
  Play,
  Layers,
  Terminal,
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
import { cn } from "@/lib/utils"

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
            <span>How it works</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[85vh] max-w-4xl overflow-hidden p-0 sm:max-w-4xl">
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <DialogHeader className="border-b border-border bg-card/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Workflow className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  BrowserPilot Guide & Documentation
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Learn how to build, automate, and execute AI-powered browser workflows.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Main Content with Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="border-b border-border bg-muted/30 px-6 py-2">
              <TabsList className="grid w-full grid-cols-5 h-9 bg-background/80">
                <TabsTrigger value="get-started" className="text-xs">
                  Getting Started
                </TabsTrigger>
                <TabsTrigger value="nodes" className="text-xs">
                  Node Catalog
                </TabsTrigger>
                <TabsTrigger value="tokens" className="text-xs">
                  Tokens & Variables
                </TabsTrigger>
                <TabsTrigger value="recipes" className="text-xs">
                  Workflow Recipes
                </TabsTrigger>
                <TabsTrigger value="observability" className="text-xs">
                  Replays & Logs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-sm">
              {/* ── TAB 1: GETTING STARTED ────────────────────────────── */}
              <TabsContent value="get-started" className="mt-0 space-y-6">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Sparkles className="size-4" />
                    <span>What is BrowserPilot?</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    BrowserPilot is an AI-powered visual browser automation canvas built on top of <strong>Stagehand V3</strong>, <strong>Browserbase</strong> cloud browsers, and <strong>Trigger.dev</strong> background execution. It allows you to automate complex web workflows using natural language instructions instead of fragile CSS selectors.
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Core 4-Step Lifecycle
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="flex size-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">
                          1
                        </span>
                        <span>Start & Navigate</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Every workflow begins with a <strong>Start</strong> trigger. Connect it to an <strong>Open URL</strong> action to launch a remote cloud browser session.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="flex size-6 items-center justify-center rounded-full bg-purple-500/10 text-xs font-bold text-purple-500">
                          2
                        </span>
                        <span>AI Actions & Extraction</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Add <strong>Act</strong> to click/type, <strong>Extract</strong> to scrape structured data, or <strong>Agent</strong> for complex autonomous multi-step reasoning.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-500">
                          3
                        </span>
                        <span>Connect & Pipe Variables</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Connect node handles to define execution order. Upstream outputs (URLs, extracted text, AI results) can be inserted into downstream fields using tokens.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-500">
                          4
                        </span>
                        <span>Run & Inspect Replay</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Hit <strong>Run</strong> to execute in the background via Trigger.dev. Watch step-by-step console logs and playback full video replays of the browser session.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                      <Zap className="size-4" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs">Ready to build your first flow?</h5>
                      <p className="text-xs text-muted-foreground">
                        Head over to the Node Catalog to see all available actions.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                    onClick={() => setActiveTab("nodes")}
                  >
                    View Nodes
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </div>
              </TabsContent>

              {/* ── TAB 2: NODE CATALOG ───────────────────────────────── */}
              <TabsContent value="nodes" className="mt-0 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Start Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-blue-500 text-white">
                          <MousePointerClick className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Start</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Trigger</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      The workflow entrypoint. Every graph must have exactly one Start trigger node.
                    </p>
                  </div>

                  {/* Open URL Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-white">
                          <Globe className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Open URL</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Action</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Navigates the cloud browser to the specified web address (e.g. <code className="text-primary font-mono">https://github.com/trending</code>).
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">url</code>, <code className="text-primary">title</code>
                    </div>
                  </div>

                  {/* Act Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-purple-500 text-white">
                          <Sparkles className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Act</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Action</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Executes an atomic AI browser action using Stagehand. Use specific, single-step prompts like <em>&quot;Click the sign in button&quot;</em> or <em>&quot;Type &apos;Next.js&apos; into the search input&quot;</em>.
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">success</code>, <code className="text-primary">message</code>
                    </div>
                  </div>

                  {/* Extract Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-amber-500 text-white">
                          <Search className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Extract</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Action</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Extracts structured or unstructured text/data from the page using natural language instructions (e.g. <em>&quot;Extract the top 5 repository names and star counts&quot;</em>).
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">extraction</code>
                    </div>
                  </div>

                  {/* Observe Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-rose-500 text-white">
                          <Eye className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Observe</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Action</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Discovers and previews candidate interactive elements on the page before executing actions.
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">matches</code>
                    </div>
                  </div>

                  {/* Agent Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-indigo-500 text-white">
                          <Bot className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Agent</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">Pro</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Autonomous Computer Use Agent (CUA) powered by Gemini / Claude. Can plan and perform multi-step tasks across pages (e.g. <em>&quot;Search for stock price of NVDA and find 52-week high&quot;</em>).
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">message</code>, <code className="text-primary">isCompleted</code>
                    </div>
                  </div>

                  {/* Send Email Node */}
                  <div className="rounded-lg border border-border bg-card p-3.5 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-orange-500 text-white">
                          <Mail className="size-4" />
                        </span>
                        <span className="font-semibold text-sm">Send Email</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Action</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Dispatches email notifications containing workflow results via Resend. You can use dynamic tokens in the subject or body to deliver extracted reports.
                    </p>
                    <div className="mt-2 flex gap-1 text-[10px] text-muted-foreground">
                      <span>Outputs:</span>
                      <code className="text-primary">id</code>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── TAB 3: TOKENS & PIPING ────────────────────────────── */}
              <TabsContent value="tokens" className="mt-0 space-y-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Code2 className="size-4" />
                    <span>How Variable Tokens Work</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    BrowserPilot supports passing dynamic outputs from upstream nodes into downstream node inputs. When an upstream node finishes, its outputs are stored in execution context.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Syntax & 1-Click Insertion
                  </h4>

                  <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Variable Token Pattern:</span>
                      <code className="rounded bg-card px-2 py-0.5 text-xs font-mono text-primary border border-border">
                        {"{{nodeId.outputKey}}"}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      When editing a node in the <strong>Editor</strong> tab, the sidebar automatically shows a <strong>Connections</strong> section with 1-click token insertion buttons for all connected upstream nodes.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                    <h5 className="font-semibold text-xs">Example: Scraping & Emailing Report</h5>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">1. Open URL</Badge>
                        <span>&rarr; Navigates to target product page</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">2. Extract</Badge>
                        <span>&rarr; Extracts price and product description</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">3. Send Email</Badge>
                        <span>&rarr; Body: &quot;Current price is {"{{extract.extraction}}"}&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── TAB 4: WORKFLOW RECIPES ───────────────────────────── */}
              <TabsContent value="recipes" className="mt-0 space-y-4">
                <div className="grid gap-3">
                  {/* Recipe 1 */}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500 text-white">
                          <Globe className="size-4" />
                        </span>
                        <h5 className="font-semibold text-sm">Competitor Price Monitoring & Alerts</h5>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">E-Commerce</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Periodically navigate to competitor stores, extract product prices, and dispatch alert emails when changes occur.
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Pipeline:</span>
                      <span>Start</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Open URL</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Extract (&quot;extract item price&quot;)</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Send Email</span>
                    </div>
                  </div>

                  {/* Recipe 2 */}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-indigo-500 text-white">
                          <Bot className="size-4" />
                        </span>
                        <h5 className="font-semibold text-sm">Autonomous Web Researcher</h5>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">AI Agent</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Use Stagehand CUA (Computer Use Agent) to perform multi-step search queries, navigate across results, and compile summaries.
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Pipeline:</span>
                      <span>Start</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Open URL (Google/Exa)</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Agent (&quot;Find 3 latest papers on LLM agents&quot;)</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Send Email</span>
                    </div>
                  </div>

                  {/* Recipe 3 */}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-md bg-purple-500 text-white">
                          <Sparkles className="size-4" />
                        </span>
                        <h5 className="font-semibold text-sm">Automated Form Filling & Sign-in</h5>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">Automation</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sequence atomic <code>Act</code> steps to fill input fields, click submit buttons, and verify authentication.
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Pipeline:</span>
                      <span>Start</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Open URL</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Act (&quot;Type email into email input&quot;)</span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span>Act (&quot;Click submit&quot;)</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ── TAB 5: OBSERVABILITY & REPLAYS ────────────────────── */}
              <TabsContent value="observability" className="mt-0 space-y-4">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-center gap-2 font-semibold text-blue-500">
                    <Video className="size-4" />
                    <span>Browserbase Session Replays</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Every workflow run executed in the cloud recording environment produces a full video replay alongside step-by-step logs and execution outputs.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-semibold text-xs">
                      <Terminal className="size-4 text-primary" />
                      <span>Live Console Logs</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      The bottom console panel provides live status tracking for every node execution, including exact duration in milliseconds, outputs, and stack traces on failure.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-semibold text-xs">
                      <Play className="size-4 text-blue-500" />
                      <span>HLS Video Playback</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Click the <strong>Session Replay</strong> button on any completed run in the console to watch an interactive video player of the actual browser session.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Layers className="size-4 text-purple-500" />
                    <span>Multiplayer Collaboration via Liveblocks</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Multiple organization members can view and edit the same workflow graph simultaneously with live presence avatars, real-time node dragging, and shared execution state.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
