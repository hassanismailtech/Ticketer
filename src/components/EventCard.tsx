import Link from "next/link";
import { UnicornEvent, formatShortDate } from "@/lib/events-data";

type EventCardProps = {
  event: UnicornEvent;
};

export function EventCard({ event }: EventCardProps) {
  const percentFilled = Math.min(100, Math.round((event.soldCount / event.capacity) * 100));
  const minPrice = Math.min(...event.tiers.map((t) => t.price));
  const hasFreeTier = event.tiers.some((t) => t.price === 0);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 backdrop-blur-xl transition duration-300 hover:border-brand-500/40 hover:shadow-glow">
      {/* Event Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f18] via-[#0c0f18]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-200 backdrop-blur-md">
            {event.category}
          </span>
          <span className="rounded-full border border-brand-400/30 bg-brand-950/70 px-2.5 py-1 text-[11px] font-semibold text-brand-300 backdrop-blur-md">
            {formatShortDate(event.date)}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-xl border border-white/10 bg-black/75 px-3 py-1 text-xs font-bold text-white shadow-soft backdrop-blur-md">
            {hasFreeTier ? "Free Admission" : `From $${minPrice}`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-brand-300 transition">
            {event.title}
          </h2>
          <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">{event.tagline}</p>
        </div>

        {/* Venue and Time metadata */}
        <div className="space-y-1.5 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-accent-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
            <span>Capacity</span>
            <span className="text-brand-300">{percentFilled}% Filled ({event.capacity - event.soldCount} spots left)</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-violet transition-all duration-500"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/event/${event.id}`}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-white shadow-soft transition hover:border-brand-500/50 hover:bg-brand-600 hover:shadow-glow active:scale-[0.98]"
        >
          <span>Select Tier & Register</span>
          <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}