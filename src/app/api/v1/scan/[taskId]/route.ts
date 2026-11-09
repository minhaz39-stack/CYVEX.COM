import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'scans',
    where: { taskId: { equals: taskId } },
    limit: 1,
    overrideAccess: false,
  })
  const scan = result.docs[0]
  if (!scan) return Response.json({ error: 'Scan task not found.' }, { status: 404 })
  return Response.json({
    task_id: scan.taskId,
    target: scan.target,
    status: scan.status,
    score: scan.score,
    verdict: scan.verdict,
    summary: scan.summary,
    error: scan.error,
    results: scan.results,
    created_at: scan.createdAt,
    updated_at: scan.updatedAt,
  })
}
