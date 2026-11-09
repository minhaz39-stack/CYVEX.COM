import Image from 'next/image'
import {
  ArrowUpRight,
  Binary,
  Braces,
  DatabaseZap,
  Fingerprint,
  Network,
  ScanLine,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { Scanner } from './components/Scanner'
import { SiteHeader } from './components/SiteHeader'
import { CyvexIntro } from './components/CyvexIntro'

const stats = [
  ['28.4M', 'Indicators analyzed'],
  ['184K', 'Threats blocked today'],
  ['99.98%', 'Detection uptime'],
  ['42 ms', 'Intel correlation'],
]

const capabilities = [
  {
    icon: Fingerprint,
    label: 'PKI integrity',
    title: 'Certificate trust, beyond the padlock',
    description:
      'Trace complete certificate paths, revocation signals, CT evidence, signature algorithms, shared primes, and weak RSA generation patterns.',
    metric: 'TLS 1.2 + 1.3',
  },
  {
    icon: ScanLine,
    label: 'Impersonation defense',
    title: 'See the page the victim sees',
    description:
      'Correlate redirects, homoglyph domains, credential forms, OAuth lures, DOM structure, and visual similarity into an explainable risk score.',
    metric: 'Rendered DOM',
  },
  {
    icon: UsersRound,
    label: 'Collective intelligence',
    title: 'Every investigation strengthens the network',
    description:
      'Blend certificate transparency, URLhaus, OTX, and verified community reports into exportable STIX 2.1 threat intelligence.',
    metric: 'STIX 2.1',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#07110f]/85">
      <CyvexIntro />
      <SiteHeader />
      <main>
        <section className="hero-grid relative border-b border-white/7 px-5 py-16 sm:py-20 lg:min-h-[760px] lg:px-8 lg:py-24">
          <div className="hero-orb absolute left-[70%] top-24 size-[560px] -translate-x-1/2 rounded-full" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-8">
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-[#07110f]/70 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.14em] text-emerald-200 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                </span>
                Autonomous cyber intelligence
              </div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.3em] text-[#5f8174]">
                Detect / Defend / Trust
              </p>
              <h1 className="max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-[72px]">
                See the threat
                <br />
                <span className="text-gradient">before it sees you.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[15px] leading-7 text-[#8ba098] sm:text-base">
                CYVEX exposes phishing infrastructure, broken trust chains, and weak cryptography
                through one explainable defense grid.
              </p>
              <div className="max-w-2xl">
                <Scanner />
              </div>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[9px] uppercase tracking-[.16em] text-[#60776e]">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-emerald-300/70" /> Private by design
                </span>
                <span className="flex items-center gap-2">
                  <Binary className="size-3.5 text-emerald-300/70" /> Explainable scoring
                </span>
                <span className="flex items-center gap-2">
                  <DatabaseZap className="size-3.5 text-emerald-300/70" /> Live intelligence
                </span>
              </div>
            </div>

            <div className="relative mx-auto grid w-full max-w-[620px] place-items-center lg:translate-x-10">
              <div className="absolute inset-[8%] rounded-full bg-emerald-300/8 blur-3xl" />
              <div className="tech-ring absolute inset-[4%] rounded-full" />
              <div className="tech-ring tech-ring--reverse absolute inset-[11%] rounded-full" />
              <div className="cyvex-orbit-dots absolute inset-[1%] rounded-full" />
              <div className="cyvex-breathe relative aspect-square w-full">
                <div className="absolute inset-[15%] overflow-hidden rounded-full border border-emerald-300/20 bg-black shadow-[0_0_80px_rgba(24,255,135,.12)]">
                  <Image
                    src="/cyvex-hero.jpg"
                    alt="CYVEX cyber defense network — Detect. Defend. Trust."
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 600px"
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,.65)_100%)]" />
                </div>
              </div>
              <div className="absolute bottom-[8%] left-[8%] rounded-xl border border-emerald-300/15 bg-[#06100d]/85 px-4 py-3 backdrop-blur-xl">
                <p className="text-[8px] uppercase tracking-[.2em] text-[#688178]">Defense mesh</p>
                <p className="mt-1 text-xs font-semibold text-emerald-300">ONLINE / 99.98%</p>
              </div>
            </div>
          </div>
        </section>

        <section id="intelligence" className="border-b border-white/7 bg-[#091410]/90">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/7 px-5 md:grid-cols-4 lg:px-8">
            {stats.map(([value, label]) => (
              <div key={label} className="px-4 py-9 text-center">
                <p className="text-2xl font-semibold tracking-[-.04em] text-white">{value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.14em] text-[#61756e]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="capabilities" className="px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="eyebrow">One investigation surface</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-.045em] text-white sm:text-4xl">
                Signals become evidence.
                <br />
                Evidence becomes action.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#81958d]">
                A layered analysis pipeline designed for security teams who need confidence,
                context, and a defensible answer.
              </p>
            </div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, label, title, description, metric }, index) => (
                <article
                  key={title}
                  className="capability-card group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0b1714] p-6"
                >
                  <div className="absolute right-0 top-0 p-5 font-mono text-[10px] text-[#435750]">
                    0{index + 1}
                  </div>
                  <span className="grid size-10 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-300/[.06] text-emerald-300">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <p className="mt-8 text-[10px] font-semibold uppercase tracking-[.15em] text-emerald-300/80">
                    {label}
                  </p>
                  <h3 className="mt-3 max-w-xs text-xl font-medium leading-7 tracking-[-.03em] text-white">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#778b84]">{description}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-white/7 pt-5">
                    <span className="font-mono text-[10px] text-[#60746c]">{metric}</span>
                    <ArrowUpRight className="size-4 text-[#50645c] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/7 bg-[#091410]/90 px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Built for transparency</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-.045em] text-white">
                Not a black box.
                <br />A glass shield.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#81958d]">
                Each score is backed by raw certificate evidence, redirect history, header checks,
                and highlighted credential traps—not an unexplained verdict.
              </p>
              <a
                href="/threat-feed"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                Open the intelligence feed <ArrowUpRight className="size-4" />
              </a>
            </div>
            <div className="relative rounded-2xl border border-white/8 bg-[#0b1714] p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between border-b border-white/7 pb-3">
                <div className="flex gap-1.5">
                  <i className="size-2 rounded-full bg-red-300/60" />
                  <i className="size-2 rounded-full bg-amber-300/60" />
                  <i className="size-2 rounded-full bg-emerald-300/60" />
                </div>
                <span className="font-mono text-[9px] text-[#52665e]">CYVEX / LIVE ANALYSIS</span>
              </div>
              <div className="space-y-3 font-mono text-[11px]">
                <p>
                  <span className="text-[#53675f]">01:42:08</span>{' '}
                  <span className="text-emerald-300">PASS</span>{' '}
                  <span className="text-[#91a59d]">TLS chain anchored to trusted root</span>
                </p>
                <p>
                  <span className="text-[#53675f]">01:42:08</span>{' '}
                  <span className="text-emerald-300">PASS</span>{' '}
                  <span className="text-[#91a59d]">RSA modulus not affected by ROCA</span>
                </p>
                <p>
                  <span className="text-[#53675f]">01:42:09</span>{' '}
                  <span className="text-amber-300">WARN</span>{' '}
                  <span className="text-[#91a59d]">Referrer-Policy is not configured</span>
                </p>
                <p>
                  <span className="text-[#53675f]">01:42:10</span>{' '}
                  <span className="text-emerald-300">PASS</span>{' '}
                  <span className="text-[#91a59d]">No credential exfiltration forms</span>
                </p>
                <p className="animate-pulse">
                  <span className="text-[#53675f]">01:42:10</span>{' '}
                  <span className="text-cyan-300">SCAN</span>{' '}
                  <span className="text-[#91a59d]">Correlating community indicators_</span>
                </p>
              </div>
              <Network className="absolute -right-5 -top-5 size-12 text-emerald-300/10" />
              <Braces className="absolute -bottom-4 -left-4 size-10 text-emerald-300/10" />
            </div>
          </div>
        </section>
      </main>
      <footer className="px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[11px] text-[#53675f] sm:flex-row">
          <span>CYVEX Security Intelligence</span>
          <span>Responsible scanning only · Built for defenders</span>
        </div>
      </footer>
    </div>
  )
}
