import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-10 sm:px-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#bd7a12]">Ticketer by HIT.DEV</p>
      <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#171617]">Welcome back</h1>
      <p className="mt-2 text-sm text-[#6d625a]">Sign in to manage your registrations and tickets.</p>
      <AuthForm />
      <p className="mt-5 text-center text-xs text-[#6d625a]">
        New to Ticketer? <Link href="/signup" className="font-semibold text-[#6b4a2c] underline">Create an account</Link>
      </p>
    </main>
  );
}
