import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0f18]/80 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-3xl text-brand-400">
          ⚡
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Pass or Event Not Located
          </h1>
          <p className="mt-2 text-xs text-zinc-400 max-w-sm mx-auto">
            The requested ticket pass code or event listing does not exist in the active register.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet px-5 py-2.5 text-xs font-bold text-white shadow-glow transition hover:opacity-95"
          >
            ← Return to Event Directory
          </Link>
        </div>
      </div>
    </main>
  );
}