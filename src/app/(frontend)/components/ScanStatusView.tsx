'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, LoaderCircle, ShieldCheck } from 'lucide-react'
import type { ScanResults } from '@/lib/aegis-types'
import { ResultsView } from './ResultsView'

type ScanTask = {
  task_id: string
  target: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  score?: number | null
  verdict?: string | null
  summary?: string | null
  error?: string | null
  results?: ScanResults | null
}

export function ScanStatusView({ initialScan }: { initialScan: ScanTask }) {
  const [scan, setScan] = useState(initialScan)
  const [pollError, setPollError] = useState('')

  useEffect(() => {
    if (scan.status === 'completed' || scan.status === 'failed') return

    let active = true
    const poll = async () => {
      try {
        const response = await fetch(`/api/v1/scan/${encodeURIComponent(scan.task_id)}`, {
          cache: 'no-store',
        })
        const nextScan = (await response.json()) as ScanTask & { error?: string }
        if (!response.ok) throw new Error(nextScan.error || 'Unable to retrieve scan status.')
        if (active) {
          setScan(nextScan)
          setPollError('')
        }
      } catch (cause) {
        if (active) {
          setPollError(cause instanceof Error ? cause.message : 'Unable to retrieve scan status.')
        }
      }
    }

    const timer = window.setInterval(poll, 1500)
    void poll()
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [scan.status, scan.task_id])

  if (scan.status === 'completed' && scan.results) {
    return (
      <ResultsView
        target={scan.target}
        score={scan.score ?? 0}
        verdict={scan.verdict ?? 'unknown'}
        summary={scan.summary ?? 'Analysis complete.'}
        results={scan.results}
      />
    )
  }

  const failed = scan.status === 'failed'
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-5">
      <div className="max-w-md text-center">
        <span
          className={`mx-auto grid size-16 place-items-center rounded-full border ${
            failed
              ? 'border-red-300/20 bg-red-300/[.05] text-red-300'
              : 'border-emerald-300/20 bg-emerald-300/[.05] text-emerald-300'
          }`}
        >
          {failed ? (
            <AlertTriangle className="size-7" />
          ) : (
            <ShieldCheck className="size-7 animate-pulse" />
          )}
        </span>
        <h1 className="mt-6 text-xl font-semibold text-white">
          {failed ? 'Analysis could not be completed' : 'Analysis in progress'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#80948c]">
          {scan.error ||
            pollError ||
            'CYVEX is correlating certificate, phishing, and posture signals.'}
        </p>
        {!failed && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#07110f]/80 px-3 py-1.5 text-[10px] uppercase tracking-[.14em] text-[#8ca199]">
            <LoaderCircle className="size-3 animate-spin text-emerald-300" />
            {scan.status === 'queued' ? 'Queued securely' : 'Inspecting target'}
          </div>
        )}
      </div>
    </main>
  )
}
