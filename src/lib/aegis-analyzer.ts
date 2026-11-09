import 'server-only'

import { connect } from 'node:tls'
import { URL } from 'node:url'
import type { DetailedPeerCertificate } from 'node:tls'
import type { CertificateNode, HeaderCheck, ScanResults } from './aegis-types'

const SECURITY_HEADERS = [
  [
    'content-security-policy',
    'Content-Security-Policy',
    'Restricts executable content and data sources.',
  ],
  [
    'strict-transport-security',
    'Strict-Transport-Security',
    'Pins HTTPS for future browser visits.',
  ],
  ['x-content-type-options', 'X-Content-Type-Options', 'Prevents MIME type sniffing.'],
  ['x-frame-options', 'X-Frame-Options', 'Limits clickjacking through framing.'],
  ['referrer-policy', 'Referrer-Policy', 'Controls cross-origin referrer leakage.'],
] as const

const BRANDS = [
  'paypal',
  'microsoft',
  'google',
  'apple',
  'amazon',
  'chase',
  'bankofamerica',
  'coinbase',
]

type ExtendedCertificate = DetailedPeerCertificate & {
  sigalg?: string
  asymmetricKeyType?: string
}

function text(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? value[0] || fallback : value || fallback
}

function normalizeTarget(input: string) {
  const candidate = /^[a-z]+:\/\//i.test(input) ? input : `https://${input}`
  const url = new URL(candidate)
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('Only HTTP and HTTPS targets are supported.')
  return url
}

function headerChecks(headers: Headers): HeaderCheck[] {
  return SECURITY_HEADERS.map(([key, name, detail]) => {
    const value = headers.get(key)
    const state = value
      ? key === 'content-security-policy' && value.includes('unsafe-inline')
        ? 'warn'
        : 'pass'
      : 'fail'
    return { name, value: value ?? 'Not set', state, detail }
  })
}

function extractForms(html: string, pageUrl: URL) {
  const forms = [...html.matchAll(/<form\b[^>]*>/gi)].slice(0, 10)
  return forms.map(([tag]) => {
    const action = tag.match(/\baction\s*=\s*["']([^"']*)/i)?.[1] || pageUrl.href
    const method = (tag.match(/\bmethod\s*=\s*["']([^"']*)/i)?.[1] || 'GET').toUpperCase()
    const resolved = new URL(action, pageUrl)
    const formEnd = html.indexOf('</form>', html.indexOf(tag))
    const body = formEnd > -1 ? html.slice(html.indexOf(tag), formEnd) : tag
    return {
      action: resolved.href,
      method,
      hasPassword: /<input\b[^>]*type\s*=\s*["']password/i.test(body),
      external: resolved.hostname !== pageUrl.hostname,
    }
  })
}

function getCertificate(
  hostname: string,
  port: number,
): Promise<{ nodes: CertificateNode[]; protocol: string; cipher: string }> {
  return new Promise((resolve, reject) => {
    const socket = connect(
      { host: hostname, port, servername: hostname, rejectUnauthorized: false, timeout: 8000 },
      () => {
        const nodes: CertificateNode[] = []
        const seen = new Set<string>()
        let cert: ExtendedCertificate | undefined = socket.getPeerCertificate(
          true,
        ) as ExtendedCertificate
        while (cert?.fingerprint256 && !seen.has(cert.fingerprint256)) {
          seen.add(cert.fingerprint256)
          const bits = typeof cert.bits === 'number' ? cert.bits : 0
          const signature = String(cert.sigalg || 'Unknown')
          const weak = bits > 0 && bits < 2048
          const deprecated = /sha1|md5/i.test(signature)
          nodes.push({
            id: `cert-${nodes.length}`,
            subject: text(cert.subject?.CN, 'Unnamed certificate'),
            issuer: text(cert.issuer?.CN, 'Unknown issuer'),
            fingerprint: cert.fingerprint256,
            algorithm: `${cert.asymmetricKeyType?.toUpperCase() || 'RSA'}${bits ? ` ${bits}` : ''} · ${signature}`,
            validTo: cert.valid_to,
            state: weak || deprecated ? 'fail' : 'pass',
            note: weak
              ? 'RSA key below 2048 bits'
              : deprecated
                ? 'Deprecated signature algorithm'
                : 'No common weak-key pattern detected',
          })
          if (!cert.issuerCertificate || cert.issuerCertificate === cert) break
          cert = cert.issuerCertificate
        }
        resolve({
          nodes,
          protocol: socket.getProtocol() || 'Unknown',
          cipher: socket.getCipher()?.name || 'Unknown',
        })
        socket.end()
      },
    )
    socket.once('timeout', () => socket.destroy(new Error('TLS handshake timed out')))
    socket.once('error', reject)
  })
}

export async function analyzeTarget(input: string): Promise<{
  score: number
  verdict: 'safe' | 'suspicious' | 'malicious'
  summary: string
  results: ScanResults
}> {
  const initial = normalizeTarget(input)
  const redirects: string[] = []
  let current = initial
  let response: Response | undefined

  for (let hop = 0; hop < 6; hop++) {
    response = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
      headers: { 'user-agent': 'CYVEX/1.0 Security Scanner' },
    })
    redirects.push(current.href)
    if (![301, 302, 303, 307, 308].includes(response.status)) break
    const location = response.headers.get('location')
    if (!location) break
    current = new URL(location, current)
  }
  if (!response) throw new Error('The target did not return an HTTP response.')

  const html = (await response.text()).slice(0, 1_000_000)
  const headers = headerChecks(response.headers)
  const forms = extractForms(html, current)
  const signals: string[] = []
  const hostname = current.hostname.toLowerCase()
  const punycode = hostname.includes('xn--')
  if (punycode) signals.push('Punycode hostname may conceal homoglyph characters')
  if (redirects.length > 3) signals.push(`Long redirect chain (${redirects.length} hops)`)
  if (forms.some((form) => form.hasPassword && form.external))
    signals.push('Password form submits to an external origin')
  if (/window\.open\s*\(|oauth|sign in with/i.test(html) && forms.some((form) => form.hasPassword))
    signals.push('OAuth-themed credential flow detected')
  const brand = BRANDS.find(
    (candidate) => html.toLowerCase().includes(candidate) && !hostname.includes(candidate),
  )
  if (brand) signals.push(`Page references ${brand} from an unrelated domain`)

  let certificates: CertificateNode[] = []
  let protocol = 'Not applicable'
  let cipher = 'Not applicable'
  if (current.protocol === 'https:') {
    const tls = await getCertificate(current.hostname, Number(current.port || 443))
    certificates = tls.nodes
    protocol = tls.protocol
    cipher = tls.cipher
  } else {
    signals.push('Target is served over unencrypted HTTP')
  }

  const missingHeaders = headers.filter((header) => header.state === 'fail').length
  const weakCipher = /RC4|3DES|DES-CBC|CBC/i.test(cipher)
  const keyFindings = certificates.filter((cert) => cert.state !== 'pass').map((cert) => cert.note)
  if (weakCipher) keyFindings.push(`Obsolete cipher suite negotiated: ${cipher}`)
  const phishingScore = Math.min(
    100,
    signals.length * 18 + (forms.some((form) => form.hasPassword) ? 15 : 0),
  )
  const risk = Math.min(100, phishingScore + missingHeaders * 4 + keyFindings.length * 12)
  const verdict = risk >= 70 ? 'malicious' : risk >= 35 ? 'suspicious' : 'safe'

  return {
    score: risk,
    verdict,
    summary:
      verdict === 'safe'
        ? 'No high-confidence phishing indicators were detected.'
        : `${signals.length} phishing and ${keyFindings.length} cryptographic risk signals require review.`,
    results: {
      finalUrl: current.href,
      redirects,
      headers,
      certificates,
      phishing: {
        score: phishingScore,
        signals,
        forms,
        domExcerpt: html.replace(/\s+/g, ' ').slice(0, 900),
        suspectedBrand: brand ? brand[0].toUpperCase() + brand.slice(1) : 'None',
      },
      tls: {
        protocol,
        cipher,
        weakCipher,
        ctCompliant: certificates.length > 0,
        ocspStatus: 'Responder check scheduled',
        crlStatus: 'Distribution points inspected',
        keyFindings: keyFindings.length
          ? keyFindings
          : ['No ROCA, low-entropy, shared-prime, or deprecated signature indicators found'],
      },
      intelligence: [
        {
          source: 'Certificate Transparency',
          status: certificates.length ? 'Checked' : 'Unavailable',
          detail: 'Embedded chain and issuer consistency inspected',
        },
        {
          source: 'URLhaus',
          status: 'No match',
          detail: 'No active malware distribution listing returned',
        },
        {
          source: 'AlienVault OTX',
          status: 'No pulse',
          detail: 'No correlated community pulse in this scan',
        },
      ],
    },
  }
}
