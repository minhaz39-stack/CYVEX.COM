'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  CircleAlert,
  Code2,
  Copy,
  ExternalLink,
  FileKey2,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Network,
  ScanSearch,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { ScanResults } from '@/lib/aegis-types'
import { TrustGraph } from './TrustGraph'
import { ThreatVectorMatrix } from './ThreatVectorMatrix'

const tone = {
  pass: 'border-emerald-300/20 bg-emerald-300/8 text-emerald-300',
  warn: 'border-amber-300/20 bg-amber-300/8 text-amber-300',
  fail: 'border-red-300/20 bg-red-300/8 text-red-300',
}

export function ResultsView({
  target,
  score,
  verdict,
  summary,
  results,
}: {
  target: string
  score: number
  verdict: string
  summary: string
  results: ScanResults
}) {
  const [tab, setTab] = useState<'rendered' | 'source'>('rendered')
  const safeScore = 100 - score
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs text-[#71857d]">
            <span>Investigations</span>
            <ChevronRight className="size-3" />
            <span className="text-[#a9bbb4]">Scan report</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white">
            Threat investigation
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-[#84978f]">
            <Globe2 className="size-4" /> <span className="max-w-xl truncate">{target}</span>
            <ExternalLink className="size-3" />
          </div>
        </div>
        <span className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-xs text-[#9bada6]">
          <Activity className="size-3.5 text-emerald-300" /> Analysis complete
        </span>
      </div>

      <section
        className={`relative overflow-hidden rounded-2xl border p-6 ${verdict === 'safe' ? 'border-emerald-300/20 bg-emerald-300/[.055]' : verdict === 'suspicious' ? 'border-amber-300/20 bg-amber-300/[.055]' : 'border-red-300/20 bg-red-300/[.055]'}`}
      >
        <div className="absolute inset-y-0 right-0 w-80 bg-[radial-gradient(circle_at_right,rgba(87,236,169,.08),transparent_70%)]" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-xl ${verdict === 'safe' ? 'bg-emerald-300/12 text-emerald-300' : 'bg-amber-300/12 text-amber-300'}`}
            >
              {verdict === 'safe' ? (
                <ShieldCheck className="size-6" />
              ) : (
                <AlertTriangle className="size-6" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold capitalize text-white">{verdict}</h2>
                <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#9db0a8]">
                  {score}/100 risk
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#91a59d]">{summary}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-semibold tracking-[-.05em] text-white">{safeScore}</div>
              <div className="text-[10px] uppercase tracking-[.14em] text-[#70847c]">
                Trust score
              </div>
            </div>
            <div className="relative grid size-16 place-items-center rounded-full border-4 border-emerald-300/15">
              <span className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-emerald-300" />
              <ShieldCheck className="size-5 text-emerald-300" />
            </div>
          </div>
        </div>
      </section>

      <ThreatVectorMatrix score={score} results={results} />

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <section className="panel lg:col-span-8">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Certificate path</p>
              <h2 className="panel-title">
                <Network className="size-4 text-emerald-300" /> TLS trust chain
              </h2>
            </div>
            <span className="badge-pass">{results.certificates.length} certificates</span>
          </div>
          <TrustGraph certificates={results.certificates} />
        </section>
        <section className="panel lg:col-span-4">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Cryptography</p>
              <h2 className="panel-title">
                <FileKey2 className="size-4 text-emerald-300" /> Key integrity
              </h2>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {[
              ['Protocol', results.tls.protocol, 'pass'],
              ['Cipher', results.tls.cipher, results.tls.weakCipher ? 'fail' : 'pass'],
              [
                'Certificate transparency',
                results.tls.ctCompliant ? 'SCT evidence present' : 'Not confirmed',
                results.tls.ctCompliant ? 'pass' : 'warn',
              ],
              ['Revocation', results.tls.ocspStatus, 'warn'],
            ].map(([label, value, state]) => (
              <div key={label} className="rounded-xl border border-white/8 bg-white/[.02] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#80938c]">{label}</span>
                  <span
                    className={`grid size-5 place-items-center rounded-full ${state === 'pass' ? 'bg-emerald-300/10 text-emerald-300' : state === 'fail' ? 'bg-red-300/10 text-red-300' : 'bg-amber-300/10 text-amber-300'}`}
                  >
                    {state === 'pass' ? (
                      <Check className="size-3" />
                    ) : (
                      <CircleAlert className="size-3" />
                    )}
                  </span>
                </div>
                <p className="mt-2 truncate text-xs font-medium text-white" title={value}>
                  {value}
                </p>
              </div>
            ))}
            <div className="rounded-xl border border-emerald-300/12 bg-emerald-300/[.04] p-3">
              <div className="flex gap-2">
                <Fingerprint className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                <p className="text-[11px] leading-5 text-[#94aaa1]">{results.tls.keyFindings[0]}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel lg:col-span-7">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Configuration audit</p>
              <h2 className="panel-title">
                <LockKeyhole className="size-4 text-emerald-300" /> Security headers
              </h2>
            </div>
            <span className="text-xs text-[#758981]">
              {results.headers.filter((h) => h.state === 'pass').length}/{results.headers.length}{' '}
              passing
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-y border-white/7 bg-white/[.015] text-[10px] uppercase tracking-[.12em] text-[#63776f]">
                <tr>
                  <th className="px-5 py-3 font-medium">Header</th>
                  <th className="px-5 py-3 font-medium">Observed value</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {results.headers.map((header) => (
                  <tr key={header.name} className="hover:bg-white/[.015]">
                    <td className="px-5 py-4 text-xs font-medium text-[#d9e5e0]">{header.name}</td>
                    <td
                      className="max-w-xs truncate px-5 py-4 font-mono text-[10px] text-[#71857d]"
                      title={header.value}
                    >
                      {header.value}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-flex rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${tone[header.state]}`}
                      >
                        {header.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel lg:col-span-5">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">External correlation</p>
              <h2 className="panel-title">
                <ScanSearch className="size-4 text-emerald-300" /> Threat intelligence
              </h2>
            </div>
          </div>
          <div className="divide-y divide-white/7">
            {results.intelligence.map((item) => (
              <div key={item.source} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-xs font-medium text-white">{item.source}</p>
                  <p className="mt-1 text-[10px] text-[#71857d]">{item.detail}</p>
                </div>
                <span className="badge-pass whitespace-nowrap">{item.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section id="raw-evidence" className="panel mt-6 scroll-mt-24">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Credential harvesting analysis</p>
            <h2 className="panel-title">
              <Code2 className="size-4 text-emerald-300" /> Phishing DOM inspector
            </h2>
          </div>
          <div className="flex rounded-lg border border-white/8 bg-black/15 p-1 text-[10px]">
            <button
              onClick={() => setTab('rendered')}
              className={`rounded-md px-3 py-1.5 ${tab === 'rendered' ? 'bg-white/8 text-white' : 'text-[#71857d]'}`}
            >
              Signals
            </button>
            <button
              onClick={() => setTab('source')}
              className={`rounded-md px-3 py-1.5 ${tab === 'source' ? 'bg-white/8 text-white' : 'text-[#71857d]'}`}
            >
              DOM source
            </button>
          </div>
        </div>
        <div className="grid min-h-80 lg:grid-cols-2">
          <div className="border-b border-white/7 p-5 lg:border-r lg:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-white">
                {tab === 'rendered' ? 'Detected behaviors' : 'Rendered DOM excerpt'}
              </span>
              <span className="text-[10px] text-[#71857d]">Score {results.phishing.score}/100</span>
            </div>
            {tab === 'rendered' ? (
              <div className="space-y-3">
                {results.phishing.signals.length ? (
                  results.phishing.signals.map((signal) => (
                    <div
                      key={signal}
                      className="flex gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[.04] p-4"
                    >
                      <AlertTriangle className="size-4 shrink-0 text-amber-300" />
                      <p className="text-xs leading-5 text-[#b5c3bd]">{signal}</p>
                    </div>
                  ))
                ) : (
                  <div className="grid h-48 place-items-center rounded-xl border border-dashed border-white/10">
                    <div className="text-center">
                      <ShieldCheck className="mx-auto size-7 text-emerald-300" />
                      <p className="mt-3 text-xs text-[#8da198]">No credential traps identified</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-black/25 p-4 text-[10px] leading-5 text-[#8fa49c]">
                {results.phishing.domExcerpt}
              </pre>
            )}
          </div>
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-white">Form destinations</span>
              <span className="text-[10px] text-[#71857d]">
                {results.phishing.forms.length} forms
              </span>
            </div>
            <div className="space-y-3">
              {results.phishing.forms.length ? (
                results.phishing.forms.map((form, index) => (
                  <div
                    key={`${form.action}-${index}`}
                    className="rounded-xl border border-white/8 bg-white/[.02] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82968e]">
                        {form.method} form
                      </span>
                      {form.external ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-300">
                          <X className="size-3" /> Cross-origin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300">
                          <Check className="size-3" /> Same-origin
                        </span>
                      )}
                    </div>
                    <p className="mt-3 truncate font-mono text-[10px] text-[#a6b8b1]">
                      {form.action}
                    </p>
                    {form.hasPassword && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-300/[.06] px-3 py-2 text-[10px] text-amber-200">
                        <LockKeyhole className="size-3" /> Password input detected
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="grid h-48 place-items-center rounded-xl border border-dashed border-white/10 text-xs text-[#71857d]">
                  No forms found in the rendered response.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
