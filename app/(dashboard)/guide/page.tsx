import { GuideView } from "@/features/workflows/components/guide-view"

interface GuidePageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function GuidePage({ searchParams }: GuidePageProps) {
  const { tab } = await searchParams
  return <GuideView initialTab={tab || "get-started"} />
}
