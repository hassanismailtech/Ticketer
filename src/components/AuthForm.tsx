"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthFormProps = { mode?: "login" | "signup" };

export function AuthForm({ mode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submitCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (mode === "signup") {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message ?? "Unable to create the account.");
        setBusy(false);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setMessage("The email or password is not correct.");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  const sendMagicLink = async () => {
    setBusy(true);
    setMessage("");
    const result = await signIn("email", { email, redirect: false, callbackUrl: "/" });
    setMessage(result?.error ? "Email sign-in is not configured yet." : "Check your inbox for your sign-in link.");
    setBusy(false);
  };

  return (
    <div className="mt-7 space-y-5 rounded-xl border border-[#e7e1dc] bg-white p-5">
      <form onSubmit={submitCredentials} className="space-y-4">
        {mode === "signup" && (
          <label className="block text-xs font-semibold text-[#6d625a]">
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-[#d9d0c8] px-3 py-2.5 text-sm text-[#171617] outline-none focus:border-[#bd7a12]" />
          </label>
        )}
        <label className="block text-xs font-semibold text-[#6d625a]">
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-[#d9d0c8] px-3 py-2.5 text-sm text-[#171617] outline-none focus:border-[#bd7a12]" />
        </label>
        <label className="block text-xs font-semibold text-[#6d625a]">
          Password
          <input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-[#d9d0c8] px-3 py-2.5 text-sm text-[#171617] outline-none focus:border-[#bd7a12]" />
        </label>
        <button disabled={busy} className="w-full rounded-lg bg-[#171617] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6b4a2c] disabled:opacity-60">
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#9a8b7e]"><span className="h-px flex-1 bg-[#e7e1dc]" />or<span className="h-px flex-1 bg-[#e7e1dc]" /></div>
      <button type="button" disabled={busy} onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full rounded-lg border border-[#d9d0c8] px-4 py-2.5 text-sm font-semibold text-[#171617] hover:border-[#bd7a12] disabled:opacity-60">Continue with Google</button>
      <button type="button" disabled={busy || !email} onClick={sendMagicLink} className="w-full rounded-lg border border-[#d9d0c8] px-4 py-2.5 text-sm font-semibold text-[#6b4a2c] hover:border-[#bd7a12] disabled:opacity-60">Email me a sign-in link</button>
      {message && <p className="text-center text-xs text-[#6b4a2c]">{message}</p>}
    </div>
  );
}
