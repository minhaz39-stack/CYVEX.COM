'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  CircleAlert,
  Database,
  Download,
  RefreshCw,
  RadioTower,
  ShieldCheck,
} from 'lucide-react'

type FeedIndicator = {
  indicator: string
  type: 'domain' | 'url' | 'ipv4' | 'certificate-fingerprint'
  confidence: number
  comment: string
  verified_at: string
}

type FeedResponse = {
  generated_at: string
  count: number
  total: number
  indicators: FeedIndicator[]
}

export function ThreatFeedWindow() {
  const [feed, setFeed] = useState<FeedResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/v1/intel/feed?format=json', { cache: 'no-store' })
      const data = (await response.json()) as FeedResponse & { error?: string }
      if (!response.ok) throw new Error(data.error || 'Threat feed is unavailable.')
      setFeed(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Threat feed is unavailable.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-300/15 bg-[#06100d]/95 shadow-[0_28px_100px_rgba(0,0,0,.5)]">
      <header className="flex flex-col gap-4 border-b border-white/8 bg-white/[.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full bg-red-300/70" />
            <i className="size-2.5 rounded-full bg-amber-300/70" />
            <i className="size-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#81978e]">
            CYVEX / Collaborative Threat Feed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/v1/intel/feed?format=stix"
            download="cyvex-threat-feed.json"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[#93a9a0] transition hover:border-emerald-300/25 hover:text-emerald-300"
          >
            <Download className="size-3.5" /> Export STIX
          </a>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-300 px-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[#042016] transition hover:bg-emerald-200 disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </header>

      <div className="grid border-b border-white/8 sm:grid-cols-3">
        <Metric
          icon={RadioTower}
          label="Feed status"
          value={error ? 'DEGRADED' : 'ONLINE'}
          tone={error ? 'text-amber-300' : 'text-emerald-300'}
        />
        <Metric icon={Database} label="Verified indicators" value={String(feed?.total ?? 0)} />
        <Metric
          icon={Activity}
          label="Last synchronized"
          value={feed ? new Date(feed.generated_at).toLocaleTimeString() : 'WAITING'}
        />
      </div>

      <div className="min-h-96">
        {error ? (
          <div className="grid min-h-96 place-items-center px-6 text-center">
            <div>
              <CircleAlert className="mx-auto size-8 text-amber-300" />
              <h2 className="mt-4 text-sm font-semibold text-white">Feed connection interrupted</h2>
              <p className="mt-2 text-xs text-[#7f958c]">{error}</p>
            </div>
          </div>
        ) : loading && !feed ? (
          <div className="grid min-h-96 place-items-center">
            <div className="text-center">
              <RefreshCw className="mx-auto size-7 animate-spin text-emerald-300" />
              <p className="mt-4 text-[10px] uppercase tracking-[.18em] text-[#71877e]">
                Synchronizing indicators
              </p>
            </div>
          </div>
        ) : feed?.indicators.length ? (
          <div className="divide-y divide-white/7">
            <div className="hidden grid-cols-[150px_1fr_100px_180px] gap-4 bg-black/15 px-5 py-3 text-[9px] uppercase tracking-[.14em] text-[#5f756c] md:grid">
              <span>Signal type</span>
              <span>Indicator</span>
              <span>Confidence</span>
              <span>Verified</span>
            </div>
            {feed.indicators.map((item) => (
              <article
                key={`${item.type}-${item.indicator}`}
                className="grid gap-3 px-5 py-4 transition hover:bg-emerald-300/[.025] md:grid-cols-[150px_1fr_100px_180px] md:items-center md:gap-4"
              >
                <span className="w-fit rounded-md border border-emerald-300/15 bg-emerald-300/[.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-emerald-300">
                  {item.type}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-white" title={item.indicator}>
                    {item.indicator}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-[#6f857c]">{item.comment}</p>
                </div>
                <span className="text-xs font-semibold text-[#afc2ba]">{item.confidence}%</span>
                <span className="text-[10px] text-[#6f857c]">
                  {new Date(item.verified_at).toLocaleString()}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-96 place-items-center px-6 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-emerald-300/15 bg-emerald-300/[.04]">
                <ShieldCheck className="size-6 text-emerald-300" />
              </span>
              <h2 className="mt-5 text-sm font-semibold text-white">
                No verified threats published
              </h2>
              <p className="mt-2 max-w-md text-xs leading-5 text-[#71877e]">
                The feed is connected and healthy. Verified community indicators will appear here as
                they are approved.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = 'text-white',
}: {
  icon: typeof Activity
  label: string
  value: string
  tone?: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
      <Icon className="size-4 text-emerald-300/70" />
      <div>
        <p className="text-[8px] uppercase tracking-[.16em] text-[#5f756c]">{label}</p>
        <p className={`mt-1 text-xs font-semibold ${tone}`}>{value}</p>
      </div>
    </div>
  )
}
