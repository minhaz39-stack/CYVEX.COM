import { getPayload } from 'payload'
import config from '@payload-config'

const responseHeaders = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
}

function escapePatternValue(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}

function stixPattern(type: 'domain' | 'url' | 'ipv4' | 'certificate-fingerprint', value: string) {
  const escaped = escapePatternValue(value)
  switch (type) {
    case 'domain':
      return `[domain-name:value = '${escaped}']`
    case 'ipv4':
      return `[ipv4-addr:value = '${escaped}']`
    case 'certificate-fingerprint':
      return `[x509-certificate:hashes.'SHA-256' = '${escaped}']`
    default:
      return `[url:value = '${escaped}']`
  }
}

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get('format') || 'json'
  if (format !== 'json' && format !== 'stix') {
    return Response.json(
      { error: 'Unsupported feed format. Use "json" or "stix".' },
      { status: 400, headers: responseHeaders },
    )
  }

  const payload = await getPayload({ config })
  const reports = await payload.find({
    collection: 'intel-reports',
    where: { status: { equals: 'verified' } },
    limit: 100,
    sort: '-createdAt',
    overrideAccess: true,
  })

  if (format === 'stix') {
    const bundle = {
      type: 'bundle',
      id: `bundle--${crypto.randomUUID()}`,
      objects: reports.docs.map((report) => ({
        type: 'indicator',
        spec_version: '2.1',
        id: `indicator--${crypto.randomUUID()}`,
        created: report.createdAt,
        modified: report.updatedAt,
        name: `Community reported ${report.type}`,
        description: report.comment,
        pattern_type: 'stix',
        pattern: stixPattern(report.type, report.indicator),
        valid_from: report.createdAt,
        confidence: report.confidence ?? 50,
      })),
    }
    return Response.json(bundle, {
      headers: { ...responseHeaders, 'content-type': 'application/stix+json' },
    })
  }

  return Response.json(
    {
      generated_at: new Date().toISOString(),
      count: reports.docs.length,
      total: reports.totalDocs,
      indicators: reports.docs.map((report) => ({
        indicator: report.indicator,
        type: report.type,
        confidence: report.confidence ?? 50,
        comment: report.comment,
        verified_at: report.updatedAt,
      })),
    },
    { headers: responseHeaders },
  )
}
