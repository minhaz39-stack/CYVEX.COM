'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export function CyvexIntro() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => setVisible(false), 3000)

    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="cyvex-intro fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#020705]"
      aria-label="CYVEX launch screen"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(19,255,135,.12),transparent_48%)]" />
      <div className="cyvex-circuit-grid absolute inset-0 opacity-35" />
      <div className="relative w-[min(88vw,960px)]">
        <div className="absolute inset-[-12%] rounded-full border border-emerald-300/10" />
        <div className="tech-ring tech-ring--intro absolute inset-[-6%] rounded-full" />
        <Image
          src="/cyvex-hero.jpg"
          alt="CYVEX — Detect. Defend. Trust."
          width={1280}
          height={720}
          priority
          className="cyvex-breathe relative h-auto w-full drop-shadow-[0_0_45px_rgba(30,255,145,.22)]"
        />
        <div className="mt-6 flex items-center gap-4 px-[12%]">
          <span className="text-[9px] font-semibold uppercase tracking-[.28em] text-emerald-300/70">
            Initializing defense grid
          </span>
          <span className="h-px flex-1 overflow-hidden bg-emerald-300/15">
            <span className="cyvex-intro-progress block h-full bg-emerald-300" />
          </span>
          <span className="text-[9px] text-[#617c70]">03 SEC</span>
        </div>
      </div>
    </div>
  )
}
