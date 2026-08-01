"use client"

import * as React from "react"
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"

interface WorkflowRunsContextValue {
  runs: any[] // We can type this with the specific task if needed
  isLive: boolean
  latestSteps: RunStep[] | null
}

const WorkflowRunsContext = React.createContext<WorkflowRunsContextValue | null>(null)

export function WorkflowRunsProvider({
  workflowId,
  publicAccessToken,
  children,
}: {
  workflowId: string
  publicAccessToken?: string
  children: React.ReactNode
}) {
  const { runs } = useRealtimeRunsWithTag<typeof runWorkflowTask>(
    `workflow:${workflowId}`,
    {
      accessToken: publicAccessToken,
      enabled: !!publicAccessToken,
    }
  )

  const latestRun = runs?.[0]
  
  // "Live" means the run is queued or executing (any state before completion)
  const isLive = latestRun ? !["COMPLETED", "FAILED", "CANCELED", "SYSTEM_FAILURE", "CRASHED"].includes(latestRun.status) : false

  // Prefer the run's final output steps, falling back to the live metadata steps
  const outputSteps = latestRun?.output?.steps as RunStep[] | undefined
  const metadataSteps = latestRun?.metadata?.steps as RunStep[] | undefined
  const latestSteps = outputSteps ?? metadataSteps ?? null

  const value = React.useMemo(
    () => ({
      runs,
      isLive,
      latestSteps,
    }),
    [runs, isLive, latestSteps]
  )

  return (
    <WorkflowRunsContext.Provider value={value}>
      {children}
    </WorkflowRunsContext.Provider>
  )
}

export function useLatestRunSteps() {
  const context = React.useContext(WorkflowRunsContext)
  if (!context) {
    throw new Error("useLatestRunSteps must be used within a WorkflowRunsProvider")
  }
  return {
    steps: context.latestSteps,
    isLive: context.isLive,
  }
}

export function useWorkflowRuns() {
  const context = React.useContext(WorkflowRunsContext)
  if (!context) {
    throw new Error("useWorkflowRuns must be used within a WorkflowRunsProvider")
  }
  return {
    runs: context.runs,
    isLive: context.isLive,
  }
}
