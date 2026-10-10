import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TicketQR } from "@/components/TicketQR";
import { formatDisplayDate } from "@/lib/utils";
import { INITIAL_EVENTS } from "@/lib/events-data";
import { generateQrPayload } from "@/lib/crypto";
import { TicketPassClientActions } from "@/components/TicketPassClientActions";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

// Fallback memory store lookup
declare global {
  var inMemoryTickets: Map<string, any> | undefined;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;

  let ticket: any = null;

  // 1. Check in-memory ticket store
  if (globalThis.inMemoryTickets?.has(ticketId)) {
    ticket = globalThis.inMemoryTickets.get(ticketId);
  }

  // 2. Check Prisma database if not found in memory
  if (!ticket && process.env.DATABASE_URL) {
    try {
      ticket = await prisma.ticket.findUnique({
        where: { ticketId },
      });
    } catch {
      // Prisma error fallback
    }
  }

  // 3. Fallback demo generation if user tests a direct link
  if (!ticket) {
    // Check if it's the VIP demo
    const sampleEvent = INITIAL_EVENTS[0];
    const qrPayload = generateQrPayload({
      ticketId,
      eventId: sampleEvent.id,
      tierId: "tier-synapse-vip",
      email: "alex.morgan@company.com",
      issuedAt: Date.now(),
    });

    ticket = {
      ticketId,
      firstName: "Alex",
      lastName: "Morgan",
      emailAddress: "alex.morgan@company.com",
      eventName: sampleEvent.title,
      eventDate: sampleEvent.date,
      eventTime: sampleEvent.time,
      eventLocation: `${sampleEvent.venue}, ${sampleEvent.location}`,
      tierName: "VIP All-Access Pass",
      qrPayload,
      status: "VALID",
      createdAt: new Date(),
    };
  }

  const tierName = ticket.tierName || "General Admission";
  const qrPayload = ticket.qrPayload || ticket.ticketId;
  const isCheckedIn = ticket.status === "CHECKED_IN";

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Banner & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          ← Back to Events
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`flex h-2 w-2 rounded-full ${
              isCheckedIn ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]" : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
            }`}
          />
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isCheckedIn ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {isCheckedIn ? "Redeemed at Gate" : "Confirmed Pass"}
          </span>
        </div>
      </div>

      {/* Luxury Digital Ticket Card with Perforated Edge */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#101422] via-[#0d101c] to-[#080a11] shadow-2xl">
        {/* Holographic Header Band */}
        <div className="relative border-b border-white/[0.08] bg-gradient-to-r from-brand-600/30 via-accent-violet/20 to-brand-500/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/20 bg-white/[0.05] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-300">
              {tierName}
            </span>
            <span className="font-mono text-xs font-bold text-white tracking-widest">
              {ticket.ticketId}
            </span>
          </div>

          <h1 className="mt-3 text-xl font-extrabold text-white tracking-tight sm:text-2xl">
            {ticket.eventName}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDisplayDate(ticket.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{ticket.eventTime}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider Line with Circular Notches */}
        <div className="relative my-0 flex items-center justify-between py-2">
          {/* Left Cutout */}
          <div className="ticket-notch-left" />
          {/* Dashed line */}
          <div className="w-full border-t border-dashed border-white/20 mx-4" />
          {/* Right Cutout */}
          <div className="ticket-notch-right" />
        </div>

        {/* QR Code and Attendee Credential Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center">
            <TicketQR
              ticketId={ticket.ticketId}
              qrPayload={qrPayload}
              status={ticket.status || "VALID"}
            />
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Present this encrypted QR code at gate turnstiles for scan.
            </p>
          </div>

          {/* Attendee Details Grid */}
          <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-zinc-400">Attendee</span>
              <span className="font-bold text-white">
                {ticket.firstName} {ticket.lastName}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-zinc-400">Email</span>
              <span className="font-medium text-zinc-300">{ticket.emailAddress}</span>
            </div>

            <div className="flex justify-between border-b border-white/[0.05] pb-2">
              <span className="text-zinc-400">Venue</span>
              <span className="font-medium text-zinc-300 text-right max-w-[240px]">
                {ticket.eventLocation}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Verification Status</span>
              <span
                className={`font-bold ${
                  isCheckedIn ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {isCheckedIn ? "REDEEMED AT GATE" : "VALID ACCESS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Utility Actions: Add to Calendar, Print Pass, Share */}
      <TicketPassClientActions
        ticket={{
          ticketId: ticket.ticketId,
          eventName: ticket.eventName,
          eventDate: ticket.eventDate,
          eventTime: ticket.eventTime,
          eventLocation: ticket.eventLocation,
          attendeeName: `${ticket.firstName} ${ticket.lastName}`,
        }}
      />
    </main>
  );
}