'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Crosshair, Radio } from 'lucide-react'
import type { ScanResults } from '@/lib/aegis-types'

type Mode = 'clean' | 'suspicious' | 'critical'

const axes = [
  {
    short: 'PHISHING',
    label: 'Phishing & Deception',
    detail: 'Typosquatting, homoglyphs, brand cloaking',
  },
  {
    short: 'PKI',
    label: 'Certificate & PKI Integrity',
    detail: 'Weak CA keys, CT logs, CRL and OCSP',
  },
  {
    short: 'MALWARE',
    label: 'Malware & Exploit Payload',
    detail: 'Drive-by downloads, malicious and obfuscated scripts',
  },
  {
    short: 'APPSEC',
    label: 'App Security Posture',
    detail: 'CSP, HSTS, secure cookies and exposed APIs',
  },
  {
    short: 'INFRA',
    label: 'Infrastructure & IP Reputation',
    detail: 'ASNs, blacklists and DNS hijacking risk',
  },
  {
    short: 'CONSENSUS',
    label: 'Collaborative Intel Consensus',
    detail: 'Community flags, abuse reports and honeypot hits',
  },
]

const presets: Record<Mode, { label: string; values: number[]; color: string; status: string }> = {
  clean: {
    label: 'Clean / Low Risk',
    values: [14, 9, 7, 18, 12, 8],
    color: '#00ff66',
    status: 'Low',
  },
  suspicious: {
    label: 'Suspicious',
    values: [72, 37, 28, 51, 78, 63],
    color: '#ffb020',
    status: 'Elevated',
  },
  critical: {
    label: 'Zero-Day / Compromised CA',
    values: [94, 98, 92, 88, 91, 96],
    color: '#ff3366',
    status: 'Critical',
  },
}

const signatures = [
  'Heuristic: Homoglyph brand redirection pattern',
  'PKI: Shared-prime and revocation anomalies',
  'Heuristic: Obfuscated JS redirection via eval()',
  'Posture: Missing browser isolation controls',
  'Infrastructure: High-risk ASN and DNS mismatch',
  'Consensus: Correlated abuse and honeypot hits',
]

const cx = 300
const cy = 250
const radius = 170

function point(index: number, value = 100) {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2
  const distance = radius * (value / 100)
  return [cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance] as const
}

function polygon(values: number[]) {
  return values.map((value, index) => point(index, value).join(',')).join(' ')
}

function scoreToMode(score: number): Mode {
  return score >= 70 ? 'critical' : score >= 35 ? 'suspicious' : 'clean'
}

export function ThreatVectorMatrix({ score, results }: { score: number; results: ScanResults }) {
  const initial = scoreToMode(score)
  const [mode, setMode] = useState<Mode>(initial)
  const [presetSelected, setPresetSelected] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const actual = useMemo(
    () => [
      results.phishing.score,
      Math.min(100, results.tls.keyFindings.length * 24 + (results.tls.ctCompliant ? 0 : 28)),
      results.phishing.signals.some((signal) => /script|payload|eval/i.test(signal)) ? 76 : 12,
      Math.round(
        (results.headers.filter((header) => header.state !== 'pass').length /
          Math.max(1, results.headers.length)) *
          100,
      ),
      results.intelligence.filter(
        (item) => /match|pulse|risk/i.test(item.status) && !/no /i.test(item.status),
      ).length * 28,
      results.intelligence.filter(
        (item) => /match|pulse|verified|listed/i.test(item.status) && !/no /i.test(item.status),
      ).length * 30,
    ],
    [results],
  )
  const values = presetSelected ? presets[mode].values : actual
  const preset = presets[mode]

  return (
    <section
      className="panel mt-6 overflow-visible bg-[#0a0e17]"
      aria-labelledby="threat-vector-title"
    >
      <div className="panel-heading flex-wrap">
        <div>
          <p className="eyebrow">Multidimensional risk telemetry</p>
          <h2 id="threat-vector-title" className="panel-title">
            <Crosshair className="size-4 text-[#00e5ff]" /> ThreatVector Matrix
          </h2>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-[#00e5ff]/10 bg-black/25 p-1">
          {(Object.keys(presets) as Mode[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key)
                setPresetSelected(true)
                setActive(null)
              }}
              className={`rounded-lg px-3 py-2 text-[9px] font-semibold uppercase tracking-[.1em] transition ${mode === key ? 'bg-[#00e5ff]/12 text-[#7ff4ff]' : 'text-[#647887] hover:text-white'}`}
            >
              {presets[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="threat-matrix-grid relative min-h-[520px] overflow-visible border-b border-white/7 lg:border-r lg:border-b-0">
          <svg
            viewBox="0 0 600 500"
            className="h-full min-h-[500px] w-full overflow-visible"
            role="img"
            aria-label={`Six-axis threat chart: ${preset.label}`}
          >
            <defs>
              <linearGradient id="threat-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#ff3366" />
              </linearGradient>
              <filter id="threat-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[100, 75, 50, 25].map((level) => (
              <g key={level}>
                <polygon
                  points={polygon(Array(6).fill(level))}
                  fill="none"
                  stroke="#00e5ff"
                  strokeOpacity={0.15}
                  strokeWidth="1"
                />
                <text x={cx + 8} y={cy - radius * (level / 100) + 12} fill="#4f7180" fontSize="9">
                  {level}%
                </text>
              </g>
            ))}
            {axes.map((_, index) => {
              const [x, y] = point(index)
              return (
                <line
                  key={index}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#00e5ff"
                  strokeOpacity={0.15}
                />
              )
            })}
            <polygon
              points={polygon(values)}
              fill="url(#threat-fill)"
              fillOpacity={0.25}
              stroke={preset.color}
              strokeWidth="2"
              filter="url(#threat-glow)"
              className="transition-all duration-500"
            />
            {axes.map((axis, index) => {
              const [x, y] = point(index, values[index])
              const [labelX, labelY] = point(index, 122)
              const isActive = active === index
              return (
                <g key={axis.short}>
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={
                      index === 1 || index === 2
                        ? 'start'
                        : index === 4 || index === 5
                          ? 'end'
                          : 'middle'
                    }
                    dominantBaseline="middle"
                    fill="#9cb6c4"
                    fontSize="10"
                    fontWeight="600"
                    letterSpacing="1"
                  >
                    {axis.short}
                  </text>
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 15 : 11}
                    fill={preset.color}
                    fillOpacity={0.12}
                    className="threat-node-pulse"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#0a0e17"
                    stroke={preset.color}
                    strokeWidth="3"
                    tabIndex={0}
                    role="button"
                    aria-label={`${axis.label}: ${values[index]} out of 100`}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(index)}
                    onBlur={() => setActive(null)}
                    className="cursor-pointer outline-none"
                  />
                  {isActive && (
                    <foreignObject
                      x={Math.min(390, Math.max(10, x - 105))}
                      y={Math.min(355, Math.max(10, y - 122))}
                      width="210"
                      height="120"
                      className="overflow-visible"
                    >
                      <div className="rounded-xl border border-[#00e5ff]/30 bg-[#071019]/95 p-3 shadow-[0_0_28px_rgba(0,229,255,.2)] backdrop-blur-md">
                        <p className="text-[11px] font-semibold text-white">
                          {axis.label}:{' '}
                          <span style={{ color: preset.color }}>
                            {values[index]}/100 —{' '}
                            {values[index] > 84
                              ? 'Critical'
                              : values[index] > 55
                                ? 'High'
                                : values[index] > 24
                                  ? 'Guarded'
                                  : 'Low'}
                          </span>
                        </p>
                        <p className="mt-1.5 text-[9px] leading-4 text-[#8ba3af]">
                          {signatures[index]}
                        </p>
                        <a
                          href="#raw-evidence"
                          className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#00e5ff]"
                        >
                          Inspect Raw Evidence <ArrowUpRight className="size-3" />
                        </a>
                      </div>
                    </foreignObject>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <aside className="p-5">
          <div
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em]"
            style={{ color: preset.color }}
          >
            <Radio className="size-3.5" /> {preset.status} severity profile
          </div>
          <p className="mt-4 text-xs leading-5 text-[#718998]">
            Hover or focus any vertex to inspect its score, triggered signature, and raw evidence
            link.
          </p>
          <div className="mt-5 space-y-2">
            {axes.map((axis, index) => (
              <button
                key={axis.short}
                type="button"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                className="flex w-full items-center justify-between rounded-lg border border-white/6 bg-white/[.02] px-3 py-2.5 text-left transition hover:border-[#00e5ff]/20 hover:bg-[#00e5ff]/[.04]"
              >
                <span>
                  <span className="block text-[10px] font-semibold text-[#b5c8d1]">
                    {axis.short}
                  </span>
                  <span className="mt-0.5 block text-[8px] text-[#526b78]">{axis.detail}</span>
                </span>
                <span className="font-mono text-[11px]" style={{ color: preset.color }}>
                  {values[index]}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
