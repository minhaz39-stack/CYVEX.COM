import Link from 'next/link'
import Image from 'next/image'
import { Activity, GitBranch } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-white/8 bg-[#07110f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid size-10 shrink-0 place-items-center">
            <span className="header-tech-ring absolute inset-0 rounded-full" />
            <span className="relative size-8 overflow-hidden rounded-full border border-emerald-300/30 bg-black">
              <Image src="/cyvex-hero.jpg" alt="" fill sizes="32px" className="object-cover" />
            </span>
          </span>
          <span className="text-[17px] font-semibold tracking-[0.08em] text-white">CYVEX</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#93a9a1] md:flex">
          <Link href="/#capabilities" className="transition hover:text-white">
            Platform
          </Link>
          <Link href="/#intelligence" className="transition hover:text-white">
            Intelligence
          </Link>
          <Link href="/threat-feed" className="transition hover:text-white">
            Threat feed
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:flex">
            <Activity className="size-3.5" /> All systems operational
          </span>
          <a
            href="https://github.com"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-lg text-[#82968f] transition hover:bg-white/5 hover:text-white"
          >
            <GitBranch className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
