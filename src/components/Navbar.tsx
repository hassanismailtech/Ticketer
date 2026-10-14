"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canOperate = role === "ORGANIZER" || role === "GATEKEEPER" || role === "ADMIN";

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
          <Link href="/" className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition ${pathname === "/" ? "bg-[#f5ead8] text-[#6b4a2c]" : "text-[#6d625a] hover:bg-[#f7f2ec] hover:text-[#171617]"}`}>
            Discover
          </Link>
          {canOperate && (
            <Link href="/admin" className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition ${pathname === "/admin" ? "bg-[#f5ead8] text-[#6b4a2c]" : "text-[#6d625a] hover:bg-[#f7f2ec] hover:text-[#171617]"}`}>
              Workspace
            </Link>
          )}
        </nav>

        {/* Right CTA / Live SLA pill */}
        <div className="flex items-center gap-3">
          {canOperate && <Link href="/scanner" className="rounded-lg bg-[#171617] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#6b4a2c]">Staff scanner</Link>}
          <Link href={session ? "/account" : "/login"} className="hidden rounded-lg border border-[#d9d0c8] px-3.5 py-2 text-xs font-semibold text-[#6b4a2c] transition hover:border-[#bd7a12] sm:block">
            {session ? "Account" : "Sign in"}
          </Link>
        </div>
      </div>
    </header>
  );
}
