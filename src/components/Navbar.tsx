"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Explore Events" },
    { href: "/scanner", label: "Gatekeeper Scanner", badge: "Live" },
    { href: "/admin", label: "Organizer Studio" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#06070a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-accent-violet to-brand-400 p-[1px] shadow-glow">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0b0d14]">
              <span className="text-base font-bold text-white transition group-hover:scale-110">⚡</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">TICKETER</span>
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-300 border border-brand-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wide text-zinc-400">UNIFIED EVENT ENGINE</p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition ${
                  isActive
                    ? "bg-white/[0.08] text-white shadow-soft"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                {item.label}
                {item.badge ? (
                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-accent-emerald opacity-75"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald"></span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Live SLA pill */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <span className="text-[11px] font-semibold text-emerald-300">Gatekeeper 99.9% Uptime</span>
          </div>

          <Link
            href="/scanner"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet px-3.5 py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-95 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Scan at Door</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
