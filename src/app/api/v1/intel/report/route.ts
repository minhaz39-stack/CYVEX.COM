import { getPayload } from 'payload'
import config from '@payload-config'

const TYPES = new Set(['domain', 'url', 'ipv4', 'certificate-fingerprint'])

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || user.collection !== 'admins') {
    return Response.json(
      { error: 'A verified AegisTrust session is required to submit intelligence.' },
      { status: 401 },
    )
  }

  let input: Record<string, unknown>
  try {
    input = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const indicator = typeof input.indicator === 'string' ? input.indicator.trim() : ''
  const type = typeof input.type === 'string' ? input.type : ''
  const comment = typeof input.comment === 'string' ? input.comment.trim() : ''
  if (
    !indicator ||
    indicator.length > 2048 ||
    !TYPES.has(type) ||
    !comment ||
    comment.length > 2000
  ) {
    return Response.json(
      { error: 'Indicator, supported type, and comment are required.' },
      { status: 422 },
    )
  }

  if (!user.email) {
    return Response.json(
      { error: 'The verified account must have an email address.' },
      { status: 422 },
    )
  }

  const report = await payload.create({
    collection: 'intel-reports',
    data: {
      indicator,
      type: type as 'domain' | 'url' | 'ipv4' | 'certificate-fingerprint',
      comment,
      reporter: user.email,
      verifiedReporter: true,
      confidence: 50,
      status: 'pending',
    },
    overrideAccess: false,
    user,
  })
  return Response.json({ id: report.id, status: report.status }, { status: 201 })
}
