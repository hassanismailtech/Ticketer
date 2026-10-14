import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Ticketer Pro — High-End Event Engine & Cryptographic Check-In",
  description:
    "Next-generation event ticketing platform with cryptographically signed QR passes, anti-fraud turnstile verification, and real-time organizer telemetry.",
  keywords: ["event ticketing", "qr check-in", "gatekeeper", "event management", "cryptographic tickets"],
  authors: [{ name: "HIT.DEV" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06070a] text-zinc-100 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}