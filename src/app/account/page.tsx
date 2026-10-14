import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: { event: true, tier: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-end justify-between border-b border-[#e7e1dc] pb-6">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#bd7a12]">Your account</p>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#171617]">Your tickets</h1>
          <p className="mt-2 text-sm text-[#6d625a]">{session.user.email}</p>
        </div>
        <Link href="/" className="text-xs font-semibold text-[#6b4a2c] underline">Discover events</Link>
      </div>

      <section className="mt-7 space-y-3">
        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d9d0c8] bg-white p-8 text-center">
            <h2 className="text-base font-bold text-[#171617]">No tickets yet</h2>
            <p className="mt-2 text-sm text-[#6d625a]">Your confirmed event registrations will appear here.</p>
            <Link href="/" className="mt-5 inline-flex rounded-lg bg-[#171617] px-4 py-2.5 text-xs font-semibold text-white">Browse events</Link>
          </div>
        ) : tickets.map((ticket) => (
          <Link key={ticket.ticketId} href={`/ticket/${ticket.ticketId}`} className="flex items-center justify-between rounded-xl border border-[#e7e1dc] bg-white p-4 transition hover:border-[#d3b27d] hover:shadow-[0_8px_22px_rgba(93,63,33,0.08)]">
            <div>
              <p className="text-sm font-bold text-[#171617]">{ticket.event.title}</p>
              <p className="mt-1 text-xs text-[#6d625a]">{ticket.tier.name} · {ticket.ticketId}</p>
            </div>
            <span className="text-xs font-semibold text-[#6b4a2c]">View pass</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
