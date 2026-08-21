import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TicketQR } from "@/components/TicketQR";
import { formatDisplayDate } from "@/lib/utils";

type TicketPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketId } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { ticketId },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-600">Ticket</p>
          <h1 className="text-2xl font-semibold text-zinc-900">Your registration is confirmed</h1>
          <p className="text-sm text-zinc-600">
            Show this ticket at check-in. The QR code contains only the ticket ID.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-4 text-sm text-zinc-700">
            <div>
              <p className="text-zinc-500">Ticket ID</p>
              <p className="font-medium text-zinc-900">{ticket.ticketId}</p>
            </div>
            <div>
              <p className="text-zinc-500">Attendee</p>
              <p className="font-medium text-zinc-900">
                {ticket.firstName} {ticket.lastName}
              </p>
            </div>
            <div>
              <p className="text-zinc-500">Email</p>
              <p className="font-medium text-zinc-900">{ticket.emailAddress}</p>
            </div>
            <div>
              <p className="text-zinc-500">Event</p>
              <p className="font-medium text-zinc-900">{ticket.eventName}</p>
            </div>
            <div>
              <p className="text-zinc-500">Date</p>
              <p className="font-medium text-zinc-900">{formatDisplayDate(ticket.eventDate)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Time</p>
              <p className="font-medium text-zinc-900">{ticket.eventTime}</p>
            </div>
            <div>
              <p className="text-zinc-500">Location</p>
              <p className="font-medium text-zinc-900">{ticket.eventLocation}</p>
            </div>
          </div>

          <TicketQR ticketId={ticket.ticketId} />
        </div>
      </section>
    </main>
  );
}