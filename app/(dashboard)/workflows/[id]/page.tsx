interface WorkflowPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params

  return (
    <div className="flex flex-1 items-center justify-center bg-background p-6">
      <p className="text-sm text-muted-foreground font-mono">{id}</p>
    </div>
  )
}
