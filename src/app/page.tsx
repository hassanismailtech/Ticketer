import { INITIAL_EVENTS } from "@/lib/events-data";
import { EventCard } from "@/components/EventCard";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#bd7a12]">Ticketer by HIT.DEV</p>
        <h1 className="max-w-xl text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-[#171617] sm:text-4xl">
          Simple event registration with secure QR tickets.
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-[#6d625a] sm:text-sm">
          Register attendees quickly, generate a unique ticket, and keep check-in privacy-first.
        </p>
      </section>

      <section id="events" className="space-y-3">
        {INITIAL_EVENTS.map((event) => <EventCard key={event.id} event={event} />)}
      </section>
    </main>
  );
}