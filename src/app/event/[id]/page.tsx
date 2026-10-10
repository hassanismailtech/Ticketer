import { notFound } from "next/navigation";
import Link from "next/link";
import { INITIAL_EVENTS, formatEventDate } from "@/lib/events-data";
import { RegistrationForm } from "@/components/RegistrationForm";

type EventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = INITIAL_EVENTS.find((item) => item.id === id || item.slug === id);

  if (!event) {
    notFound();
  }

  const percentFilled = Math.min(100, Math.round((event.soldCount / event.capacity) * 100));

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        ← Back to All Events
      </Link>

      {/* Event Header Hero Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0f18] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-white/20 bg-white/[0.05] px-3 py-1 text-[11px] font-bold text-zinc-200">
              {event.category}
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-[11px] font-bold text-emerald-300">
              Registration Open
            </span>
            <span className="text-xs text-zinc-400">
              • Organized by <strong className="text-white">{event.organizer.name}</strong>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300 max-w-3xl">
              {event.tagline}
            </p>
          </div>

          {/* Quick Details Bar */}
          <div className="grid gap-4 sm:grid-cols-3 border-y border-white/[0.08] py-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Date</span>
              <p className="font-bold text-white">{formatEventDate(event.date)}</p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Time</span>
              <p className="font-bold text-white">{event.time}</p>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Location</span>
              <p className="font-bold text-white truncate">{event.venue}, {event.location}</p>
            </div>
          </div>

          {/* Live Capacity Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Venue Capacity Status</span>
              <span className="font-bold text-brand-300">
                {event.soldCount} / {event.capacity} registered ({event.capacity - event.soldCount} spots left)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-accent-violet to-brand-400 transition-all duration-700"
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Description on Left, Interactive Registration on Right */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr]">
        {/* Left: About the Event & Venue Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-base font-bold text-white">About This Event</h2>
            <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-6 backdrop-blur-xl space-y-3">
            <h2 className="text-base font-bold text-white">Venue & Gate Admission</h2>
            <div className="space-y-2 text-xs text-zinc-300">
              <p>📍 <strong>Address:</strong> {event.venue}, {event.location}</p>
              <p>⚡ <strong>Gate Security:</strong> Fast-track optical QR scanners enabled at Turnstiles 1 through 4.</p>
              <p>📱 <strong>Entry Requirements:</strong> Bring digital ticket pass on your phone or printed PDF pass.</p>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div>
          <RegistrationForm
            eventId={event.id}
            eventName={event.title}
            eventDate={event.date}
            eventTime={event.time}
            eventLocation={`${event.venue}, ${event.location}`}
            tiers={event.tiers}
          />
        </div>
      </div>
    </main>
  );
}