import type { Node } from "@xyflow/react"
import {
  Globe,
  Sparkles,
  ScanText,
  ScanSearch,
  Bot,
  Mail,
  Play,
  type LucideIcon,
} from "lucide-react"

export type StepNodeKind = "trigger" | "action"

// One editable field on a node, rendered as an input in the inspector later.
export type NodeField = {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
  required?: boolean
}

export type NodeOutput = {
  path: string
  label: string
}

// A node type's manifest entry. Add a node by adding an entry to nodeRegistry.
export type NodeDefinition = {
  type: string
  kind: StepNodeKind
  label: string
  description: string
  icon: LucideIcon
  accent: string // Tailwind classes for the icon chip color
  fields: NodeField[]
  outputs?: NodeOutput[]
}

export const nodeRegistry = {
  start: {
    type: "start",
    kind: "trigger",
    label: "Start",
    description: "The workflow starting point. Initiates the browser automation run.",
    icon: Play,
    accent: "bg-blue-600 text-white",
    fields: [],
  },
  "open-url": {
    type: "open-url",
    kind: "action",
    label: "Open URL",
    description: "Navigates the browser to the specified webpage address.",
    icon: Globe,
    accent: "bg-emerald-600 text-white",
    fields: [{ key: "url", label: "URL", placeholder: "https://youtube.com", required: true }],
    outputs: [
      { path: "url", label: "URL" },
      { path: "title", label: "Title" },
    ],
  },
  act: {
    type: "act",
    kind: "action",
    label: "Act",
    description: "Executes an action on the active page using natural language.",
    icon: Sparkles,
    accent: "bg-purple-600 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Click the sign in button",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "message", label: "Message" },
      { path: "url", label: "URL" },
    ],
  },
  extract: {
    type: "extract",
    kind: "action",
    label: "Extract",
    description: "Extracts structured text or elements from the page using natural language.",
    icon: ScanText,
    accent: "bg-amber-600 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Extract the names of all the links",
        multiline: true,
        required: true,
      },
    ],
    outputs: [{ path: "extraction", label: "Result" }],
  },
  observe: {
    type: "observe",
    kind: "action",
    label: "Observe",
    description: "Inspects page DOM and returns actionable candidate elements.",
    icon: ScanSearch,
    accent: "bg-rose-600 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Find the next page button",
        multiline: true,
        required: true,
      },
    ],
    outputs: [{ path: "matches", label: "Matches" }],
  },
  agent: {
    type: "agent",
    kind: "action",
    label: "Agent",
    description: "Deploys an autonomous Computer Use Agent (CUA) to perform multi-step tasks.",
    icon: Bot,
    accent: "bg-indigo-600 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Search for the stock price of NVDA",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "message", label: "Message" },
      { path: "isCompleted", label: "Completed" },
    ],
  },
  "send-email": {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    description: "Dispatches transactional emails with interpolated variables via Resend.",
    icon: Mail,
    accent: "bg-orange-600 text-white",
    fields: [
      { key: "to", label: "To", placeholder: "recipient@example.com", required: true },
      { key: "subject", label: "Subject", placeholder: "Hello World", required: true },
      { key: "body", label: "Body", placeholder: "Write your message here...", multiline: true, required: true },
    ],
    outputs: [{ path: "id", label: "Email ID" }],
  },
} satisfies Record<string, NodeDefinition>

export type NodeType = keyof typeof nodeRegistry

// Plain JSON only (synced through Liveblocks later). type keys into the registry;
// kind and title are denormalized so the server can read them without the registry.
export type StepNodeData = {
  type: NodeType
  kind: StepNodeKind
  title: string
  values: Record<string, string>
}

export type StepNodeType = Node<StepNodeData, "step">

export type ActionNodeType = {
  [K in NodeType]: StepNodeData["type"] extends "action"
    ? Node<{
        type: K
      }>
    : never
}[NodeType]