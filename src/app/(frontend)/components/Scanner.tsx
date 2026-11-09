'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Globe2, LoaderCircle, ShieldAlert } from 'lucide-react'

export function Scanner() {
  const router = useRouter()
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function scan() {
    if (!target.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/v1/scan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: target.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to start scan')
      router.push(`/scan/${data.task_id}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start scan')
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto mt-10 max-w-3xl">
      <div className="scan-glow relative overflow-hidden rounded-2xl border border-white/12 bg-[#0d1916]/95 p-2 shadow-2xl">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Globe2 className="size-5 shrink-0 text-[#6d827a]" />
            <input
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && scan()}
              placeholder="Enter a URL or domain to investigate"
              aria-label="URL or domain"
              disabled={loading}
              className="h-13 min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-[#60756d]"
            />
          </div>
          <button
            onClick={scan}
            disabled={loading || !target.trim()}
            className="group flex h-13 items-center justify-center gap-2 rounded-xl bg-[#78f5bd] px-6 text-sm font-semibold text-[#062016] transition hover:bg-[#a0ffd1] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ShieldAlert className="size-4" />
            )}
            {loading ? 'Analyzing' : 'Analyze threat'}
            {!loading && <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />}
          </button>
        </div>
      </div>
      <div className="mt-3 flex min-h-6 items-center justify-between px-1 text-xs text-[#63766f]">
        <span>{error || 'TLS chain · phishing signals · security posture'}</span>
        <span className="hidden sm:block">No account required</span>
      </div>
    </div>
  )
}
