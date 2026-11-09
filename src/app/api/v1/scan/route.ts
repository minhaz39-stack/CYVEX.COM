import { randomUUID } from 'node:crypto'
import { after } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { analyzeTarget } from '@/lib/aegis-analyzer'

export const maxDuration = 30

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const target = typeof body === 'object' && body && 'url' in body ? String(body.url).trim() : ''
  if (!target || target.length > 2048) {
    return Response.json(
      { error: 'A URL between 1 and 2048 characters is required.' },
      { status: 422 },
    )
  }

  const payload = await getPayload({ config })
  const taskId = randomUUID()
  const created = await payload.create({
    collection: 'scans',
    data: { taskId, target, status: 'queued', verdict: 'unknown', score: 0 },
    overrideAccess: false,
  })

  after(async () => {
    try {
      await payload.update({
        collection: 'scans',
        id: created.id,
        data: { status: 'running' },
        overrideAccess: true,
      })
      const analysis = await analyzeTarget(target)
      await payload.update({
        collection: 'scans',
        id: created.id,
        data: { status: 'completed', ...analysis },
        overrideAccess: true,
      })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'The target could not be analyzed.'
      await payload.update({
        collection: 'scans',
        id: created.id,
        data: {
          status: 'failed',
          error: message,
          summary:
            'The target was unreachable, blocked automated access, or returned invalid data.',
        },
        overrideAccess: true,
      })
    }
  })

  return Response.json({ task_id: taskId, status: 'queued' }, { status: 202 })
}
