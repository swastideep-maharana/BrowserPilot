import { Spinner } from "@/components/ui/spinner"

export default function WorkflowLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background p-6">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}
