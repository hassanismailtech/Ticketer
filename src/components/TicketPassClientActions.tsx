"use client";

import { useState } from "react";
import Link from "next/link";

type TicketActionsProps = {
  ticket: {
    ticketId: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    attendeeName: string;
  };
};

export function TicketPassClientActions({ ticket }: TicketActionsProps) {
  const [copied, setCopied] = useState(false);

  // Generate and download .ics calendar file
  const downloadCalendarFile = () => {
    const startDate = ticket.eventDate.replace(/-/g, "") + "T090000Z";
    const endDate = ticket.eventDate.replace(/-/g, "") + "T180000Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ticketer Pro//Event Ticket//EN",
      "BEGIN:VEVENT",
      `UID:${ticket.ticketId}@ticketer.hit.dev`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${ticket.eventName}`,
      `DESCRIPTION:Your ticket reference is ${ticket.ticketId}. Show your QR pass at gate check-in.`,
      `LOCATION:${ticket.eventLocation}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${ticket.ticketId}-event.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ticket.eventName} — Ticket Pass`,
          text: `Here is my confirmed ticket pass for ${ticket.eventName}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Calendar Button */}
        <button
          type="button"
          onClick={downloadCalendarFile}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold text-white transition hover:bg-white/[0.08] active:scale-[0.98]"
        >
          <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Add to Calendar</span>
        </button>

        {/* Print / PDF Button */}
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold text-white transition hover:bg-white/[0.08] active:scale-[0.98]"
        >
          <svg className="h-4 w-4 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print / Save PDF</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs font-semibold text-white transition hover:bg-white/[0.08] active:scale-[0.98]"
        >
          <svg className="h-4 w-4 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{copied ? "Link Copied! ✓" : "Share Pass"}</span>
        </button>
      </div>

      {/* Direct link to test gate scanner */}
      <Link
        href="/scanner"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs font-bold text-emerald-300 transition hover:bg-emerald-900/40"
      >
        <span>⚡ Test Scan this Pass at Turnstile Gate</span>
        <span>→</span>
      </Link>
    </div>
  );
}
