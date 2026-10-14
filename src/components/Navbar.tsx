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
    <header className="sticky top-0 z-50 w-full border-b border-[#e7e1dc] bg-[#fbfaf8]/95">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bd7a12] text-sm font-bold text-[#bd7a12]">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#171617]">TICKETER</span>
            </div>
            <p className="text-[10px] font-medium tracking-wide text-[#6d625a]">BY HIT.DEV</p>
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
                    ? "bg-[#f5ead8] text-[#6b4a2c]"
                    : "text-[#6d625a] hover:bg-[#f7f2ec] hover:text-[#171617]"
                }`}
              >
                {item.label}
                {item.badge ? (
                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#bd7a12]"></span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Live SLA pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/scanner"
            className="flex items-center gap-2 rounded-lg bg-[#171617] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#6b4a2c]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Staff scanner</span>
          </Link>
          <Link href="/login" className="hidden rounded-lg border border-[#d9d0c8] px-3.5 py-2 text-xs font-semibold text-[#6b4a2c] transition hover:border-[#bd7a12] sm:block">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
