import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-10 sm:px-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#bd7a12]">Ticketer by HIT.DEV</p>
      <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#171617]">Create your account</h1>
      <p className="mt-2 text-sm text-[#6d625a]">Use a password, Google, or an email sign-in link.</p>
      <AuthForm mode="signup" />
      <p className="mt-5 text-center text-xs text-[#6d625a]">
        Already registered? <Link href="/login" className="font-semibold text-[#6b4a2c] underline">Sign in</Link>
      </p>
    </main>
  );
}
