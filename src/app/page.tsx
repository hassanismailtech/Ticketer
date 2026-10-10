import Link from "next/link";
import { INITIAL_EVENTS } from "@/lib/events-data";
import { EventCard } from "@/components/EventCard";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#101424] via-[#0b0e17] to-[#06070a] p-8 sm:p-14 text-center shadow-2xl">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 h-48 w-48 rounded-full bg-accent-violet/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-950/60 px-4 py-1 text-xs font-bold text-brand-300 backdrop-blur-md shadow-glow">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <span>UNIFIED TICKETING & GATEKEEPER SUITE 2.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Where high-calibre events meet{" "}
            <span className="bg-gradient-to-r from-brand-400 via-accent-violet to-accent-cyan bg-clip-text text-transparent">
              cryptographic check-in.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Issue tamper-proof dynamic QR passes, eliminate turnstile double-entry fraud with HMAC-SHA256 signatures, and track real-time venue door velocity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#events"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet px-6 py-3 text-xs font-bold text-white shadow-glow transition hover:opacity-95 active:scale-95"
            >
              <span>Explore Live Events</span>
              <span>↓</span>
            </a>
            <Link
              href="/scanner"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-bold text-white transition hover:bg-white/[0.08] active:scale-95"
            >
              <span>Launch Gatekeeper Scanner</span>
              <span className="text-emerald-400">⚡</span>
            </Link>
          </div>

          {/* Live Telemetry Ticker */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-4 text-center">
            <div>
              <p className="text-xl font-black text-white sm:text-2xl">14,800+</p>
              <p className="text-[11px] font-medium text-zinc-400">Passes Issued</p>
            </div>
            <div>
              <p className="text-xl font-black text-emerald-400 sm:text-2xl">99.99%</p>
              <p className="text-[11px] font-medium text-zinc-400">Turnstile SLA</p>
            </div>
            <div>
              <p className="text-xl font-black text-brand-300 sm:text-2xl">&lt; 0.4s</p>
              <p className="text-[11px] font-medium text-zinc-400">Scan Latency</p>
            </div>
            <div>
              <p className="text-xl font-black text-accent-cyan sm:text-2xl">0%</p>
              <p className="text-[11px] font-medium text-zinc-400">Duplicate Fraud</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section id="events" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-400">Curated Lineup</p>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Featured Conferences & Gatherings
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time inventory sync with instant digital pass issuance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INITIAL_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Architectural Pillars / Unicorn Value Section */}
      <section className="rounded-3xl border border-white/[0.08] bg-[#0c0f18]/80 p-8 backdrop-blur-xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Enterprise Event Infrastructure
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Why High-Growth Organizers Choose Ticketer Pro
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-lg">
              🛡️
            </div>
            <h3 className="text-sm font-bold text-white">Cryptographic Anti-Counterfeiting</h3>
            <p className="leading-relaxed text-zinc-400">
              Passes are hashed with HMAC-SHA256 signatures and anti-screenshot dynamic radar pulses, eliminating screenshots and scalping duplication.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">
              ⚡
            </div>
            <h3 className="text-sm font-bold text-white">Instant Gatekeeper Scanner</h3>
            <p className="leading-relaxed text-zinc-400">
              Staff scan tickets directly in-browser on phones or handheld barcode lasers with instant Web Audio synthesizer chimes and haptic feedback.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-violet/10 text-accent-violet text-lg">
              📊
            </div>
            <h3 className="text-sm font-bold text-white">Real-Time Door Velocity</h3>
            <p className="leading-relaxed text-zinc-400">
              Monitor turnstile throughput, attendee check-in velocity, and tier capacities with second-by-second audit streaming.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-semibold text-zinc-400">
          TICKETER PRO — Engineered for Mission-Critical Events.
        </p>
        <p>© 2026 HIT.DEV. All rights reserved.</p>
      </footer>
    </main>
  );
}