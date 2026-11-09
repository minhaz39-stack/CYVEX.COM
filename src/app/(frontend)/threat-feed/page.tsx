import type { Metadata } from 'next'
import { SiteHeader } from '../components/SiteHeader'
import { ThreatFeedWindow } from '../components/ThreatFeedWindow'

export const metadata: Metadata = {
  title: 'Threat Feed — CYVEX',
  description: 'Live verified collaborative threat intelligence from the CYVEX defense network.',
}

export default function ThreatFeedPage() {
  return (
    <div className="min-h-screen bg-[#07110f]/85">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Collaborative intelligence</p>
            <h1 className="mt-3 text-3xl font-medium tracking-[-.045em] text-white sm:text-4xl">
              Verified threat feed
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f958c]">
              Review trusted community indicators, monitor confidence, and export interoperable STIX
              2.1 intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-[#60776e]">
            <span className="size-2 animate-pulse rounded-full bg-emerald-300" />
            Live Payload connection
          </div>
        </div>
        <ThreatFeedWindow />
      </main>
    </div>
  )
}
