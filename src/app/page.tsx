import { EventCard } from "@/components/EventCard";
import { events } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-600">
            Ticketer by HIT.DEV
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Simple event registration with secure QR tickets.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            Register attendees quickly, generate a unique ticket, and keep check-in privacy-first.
          </p>
        </div>

        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}