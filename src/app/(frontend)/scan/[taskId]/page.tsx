import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteHeader } from '../../components/SiteHeader'
import { ScanStatusView } from '../../components/ScanStatusView'
import type { ScanResults } from '@/lib/aegis-types'

export const dynamic = 'force-dynamic'

export default async function ScanPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'scans',
    where: { taskId: { equals: taskId } },
    limit: 1,
    overrideAccess: false,
  })
  const scan = result.docs[0]
  if (!scan) notFound()

  return (
    <div className="min-h-screen bg-[#07110f]/85">
      <SiteHeader />
      <ScanStatusView
        initialScan={{
          task_id: scan.taskId,
          target: scan.target,
          status: scan.status,
          score: scan.score,
          verdict: scan.verdict,
          summary: scan.summary,
          error: scan.error,
          results: scan.results as unknown as ScanResults | null | undefined,
        }}
      />
    </div>
  )
}
