import { Globe, Bot, TrendingUp, Sparkles, Newspaper, type LucideIcon } from "lucide-react"
import type { StepNodeType } from "@/features/workflows/nodes/node-registry"
import type { Edge } from "@xyflow/react"
import type { WorkflowGraph } from "@/lib/db/schema"

export interface WorkflowTemplate {
  id: string
  title: string
  description: string
  tag: string
  icon: LucideIcon
  iconBg: string
  steps: string[]
  details: string
  initialGraph: WorkflowGraph
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "ecom-price-tracker",
    title: "E-Commerce Price Tracker",
    description: "Navigate to an online store, extract product price and stock availability, and dispatch an email alert.",
    tag: "Scraping",
    icon: TrendingUp,
    iconBg: "bg-amber-600 text-white",
    steps: ["Start", "Open URL", "Extract", "Send Email"],
    details: "Automates competitive intelligence by visiting any e-commerce listing, scraping dynamic pricing, and delivering email notifications when prices update.",
    initialGraph: {
      nodes: [
        {
          id: "start-node",
          type: "step",
          position: { x: 50, y: 180 },
          data: { type: "start", kind: "trigger", title: "Start", values: {} },
        },
        {
          id: "open-store",
          type: "step",
          position: { x: 320, y: 180 },
          data: {
            type: "open-url",
            kind: "action",
            title: "Open Store URL",
            values: { url: "https://news.ycombinator.com" },
          },
        },
        {
          id: "extract-price",
          type: "step",
          position: { x: 600, y: 180 },
          data: {
            type: "extract",
            kind: "action",
            title: "Extract Price & Title",
            values: { instruction: "Extract the top article title, points score, and author username" },
          },
        },
        {
          id: "send-alert",
          type: "step",
          position: { x: 880, y: 180 },
          data: {
            type: "send-email",
            kind: "action",
            title: "Send Price Alert",
            values: {
              to: "user@example.com",
              subject: "Tracked Price Update: {{extract-price.extraction}}",
              body: "Here is the extracted update from the automated run:\n\n{{extract-price.extraction}}",
            },
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "start-node", target: "open-store", type: "smoothstep" },
        { id: "e2-3", source: "open-store", target: "extract-price", type: "smoothstep" },
        { id: "e3-4", source: "extract-price", target: "send-alert", type: "smoothstep" },
      ],
    },
  },
  {
    id: "ai-web-researcher",
    title: "Autonomous Web Researcher",
    description: "Deploy an AI Agent to autonomously browse, search multiple sources, and summarize research findings.",
    tag: "AI Agent",
    icon: Bot,
    iconBg: "bg-indigo-500 text-white",
    steps: ["Start", "Open URL", "Agent (CUA)", "Send Email"],
    details: "Empowers an autonomous Stagehand Computer Use Agent to plan multi-step web searches, cross-reference data, and compile structured executive briefings.",
    initialGraph: {
      nodes: [
        {
          id: "start-node",
          type: "step",
          position: { x: 50, y: 180 },
          data: { type: "start", kind: "trigger", title: "Start", values: {} },
        },
        {
          id: "open-google",
          type: "step",
          position: { x: 320, y: 180 },
          data: {
            type: "open-url",
            kind: "action",
            title: "Open Search Engine",
            values: { url: "https://www.google.com" },
          },
        },
        {
          id: "agent-research",
          type: "step",
          position: { x: 600, y: 180 },
          data: {
            type: "agent",
            kind: "action",
            title: "Autonomous Research",
            values: { instruction: "Search for the latest AI browser automation breakthroughs in 2025 and summarize the top 3 insights." },
          },
        },
        {
          id: "send-summary",
          type: "step",
          position: { x: 880, y: 180 },
          data: {
            type: "send-email",
            kind: "action",
            title: "Send Research Briefing",
            values: {
              to: "research@example.com",
              subject: "AI Research Briefing Summary",
              body: "Here is your autonomous research briefing:\n\n{{agent-research.message}}",
            },
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "start-node", target: "open-google", type: "smoothstep" },
        { id: "e2-3", source: "open-google", target: "agent-research", type: "smoothstep" },
        { id: "e3-4", source: "agent-research", target: "send-summary", type: "smoothstep" },
      ],
    },
  },
  {
    id: "auto-login-fill",
    title: "Automated Form & Interaction",
    description: "Fill login credentials using natural language Act instructions and capture dashboard verification.",
    tag: "Automation",
    icon: Sparkles,
    iconBg: "bg-purple-500 text-white",
    steps: ["Start", "Open URL", "Act (Type)", "Act (Click)"],
    details: "Demonstrates natural language DOM manipulation with Stagehand Act. Fills authentication credentials and triggers navigation without fragile selectors.",
    initialGraph: {
      nodes: [
        {
          id: "start-node",
          type: "step",
          position: { x: 50, y: 180 },
          data: { type: "start", kind: "trigger", title: "Start", values: {} },
        },
        {
          id: "open-portal",
          type: "step",
          position: { x: 320, y: 180 },
          data: {
            type: "open-url",
            kind: "action",
            title: "Open Portal",
            values: { url: "https://github.com/login" },
          },
        },
        {
          id: "act-type-username",
          type: "step",
          position: { x: 600, y: 180 },
          data: {
            type: "act",
            kind: "action",
            title: "Type Username",
            values: { instruction: "Type 'demo-pilot' into the username or email address input field" },
          },
        },
        {
          id: "act-click-submit",
          type: "step",
          position: { x: 880, y: 180 },
          data: {
            type: "act",
            kind: "action",
            title: "Click Sign In",
            values: { instruction: "Click the primary Sign In button" },
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "start-node", target: "open-portal", type: "smoothstep" },
        { id: "e2-3", source: "open-portal", target: "act-type-username", type: "smoothstep" },
        { id: "e3-4", source: "act-type-username", target: "act-click-submit", type: "smoothstep" },
      ],
    },
  },
  {
    id: "daily-digest-reporter",
    title: "Web Headline Digest",
    description: "Scrape top trending repositories or news headlines and email a structured morning briefing.",
    tag: "Reporting",
    icon: Newspaper,
    iconBg: "bg-emerald-600 text-white",
    steps: ["Start", "Open URL", "Extract", "Send Email"],
    details: "Collects daily trending topics from GitHub or developer news boards and sends a formatted morning email digest.",
    initialGraph: {
      nodes: [
        {
          id: "start-node",
          type: "step",
          position: { x: 50, y: 180 },
          data: { type: "start", kind: "trigger", title: "Start", values: {} },
        },
        {
          id: "open-trending",
          type: "step",
          position: { x: 320, y: 180 },
          data: {
            type: "open-url",
            kind: "action",
            title: "Open Trending Feed",
            values: { url: "https://github.com/trending" },
          },
        },
        {
          id: "extract-headlines",
          type: "step",
          position: { x: 600, y: 180 },
          data: {
            type: "extract",
            kind: "action",
            title: "Extract Top Repos",
            values: { instruction: "Extract the top 5 repository names, descriptions, and star counts" },
          },
        },
        {
          id: "email-digest",
          type: "step",
          position: { x: 880, y: 180 },
          data: {
            type: "send-email",
            kind: "action",
            title: "Send Daily Digest",
            values: {
              to: "digest@example.com",
              subject: "Daily Trending GitHub Repositories",
              body: "Good morning! Here is today's trending repositories digest:\n\n{{extract-headlines.extraction}}",
            },
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "start-node", target: "open-trending", type: "smoothstep" },
        { id: "e2-3", source: "open-trending", target: "extract-headlines", type: "smoothstep" },
        { id: "e3-4", source: "extract-headlines", target: "email-digest", type: "smoothstep" },
      ],
    },
  },
]
