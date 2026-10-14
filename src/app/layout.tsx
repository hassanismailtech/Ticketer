import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";

export const metadata: Metadata = {
  title: "Ticketer by HIT.DEV — Simple event registration",
  description:
    "Register attendees quickly, generate a unique ticket, and keep check-in privacy-first.",
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
    <html lang="en">
      <body className="min-h-screen bg-[#fbfaf8] text-[#171617] antialiased selection:bg-[#f5dfb4] selection:text-[#171617]">
        <AuthSessionProvider>
          <Navbar />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}