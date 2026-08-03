"use client"

import { Globe, Bot, Search, Sparkles, ArrowRight, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface WorkflowTemplate {
  id: string
  title: string
  description: string
  tag: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  steps: string[]
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "ecom-price-tracker",
    title: "E-Commerce Price Tracker",
    description: "Navigate to an online store, extract the current product price and stock, and send an email alert.",
    tag: "Scraping",
    icon: Search,
    iconBg: "bg-amber-500 text-white",
    steps: ["Start", "Open URL", "Extract Price", "Send Email"],
  },
  {
    id: "ai-web-researcher",
    title: "Autonomous Web Researcher",
    description: "Deploy an AI Agent to autonomously browse, search multiple sources, and summarize research findings.",
    tag: "AI Agent",
    icon: Bot,
    iconBg: "bg-indigo-500 text-white",
    steps: ["Start", "Open URL", "AI Agent (CUA)", "Send Email"],
  },
  {
    id: "auto-login-fill",
    title: "Automated Login & Interaction",
    description: "Fill login credentials using natural language Act instructions and capture dashboard verification.",
    tag: "Automation",
    icon: Sparkles,
    iconBg: "bg-purple-500 text-white",
    steps: ["Start", "Open URL", "Act (Type Input)", "Act (Click Submit)"],
  },
  {
    id: "daily-digest-reporter",
    title: "Web Headline Digest",
    description: "Scrape top headlines or trending repositories and email a structured morning briefing.",
    tag: "Reporting",
    icon: Globe,
    iconBg: "bg-emerald-500 text-white",
    steps: ["Start", "Open URL", "Extract Headlines", "Send Email"],
  },
]

interface TemplateCardsProps {
  onSelectTemplate?: (template: WorkflowTemplate) => void
  onOpenGuide?: (tab: string) => void
}

export function TemplateCards({ onSelectTemplate, onOpenGuide }: TemplateCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {WORKFLOW_TEMPLATES.map((tmpl) => {
        const Icon = tmpl.icon
        return (
          <div
            key={tmpl.id}
            className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/60 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg shadow-xs ${tmpl.iconBg}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {tmpl.title}
                  </h4>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0 font-normal">
                  {tmpl.tag}
                </Badge>
              </div>

              <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                {tmpl.description}
              </p>

              {/* Step Pipeline Flow */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground border border-border/50">
                {tmpl.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="font-medium text-foreground">{step}</span>
                    {idx < tmpl.steps.length - 1 && (
                      <ArrowRight className="size-3 text-muted-foreground/60" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                onClick={() => onOpenGuide?.("recipes")}
              >
                View Blueprint
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors px-3"
                onClick={() => onSelectTemplate?.(tmpl)}
              >
                <span>Use template</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
