import Link from "next/link";
import Image from "next/image";
import { UnicornEvent, formatShortDate } from "@/lib/events-data";

type EventCardProps = {
  event: UnicornEvent;
};

export function EventCard({ event }: EventCardProps) {
  const percentFilled = Math.min(100, Math.round((event.soldCount / event.capacity) * 100));
  const minPrice = Math.min(...event.tiers.map((t) => t.price));
  const hasFreeTier = event.tiers.some((t) => t.price === 0);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e7e1dc] bg-white p-4 transition duration-200 hover:border-[#d3b27d] hover:shadow-[0_8px_22px_rgba(93,63,33,0.08)]">
      <div className="relative mb-1 h-36 overflow-hidden rounded-lg bg-[#f5ead8]">
        <Image src={event.bannerUrl} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6b4a2c]">{event.category}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bd7a12]">Event</p>
          <h2 className="text-sm font-bold tracking-tight text-[#171617] transition group-hover:text-[#6b4a2c]">
            {event.title}
          </h2>
          <p className="text-xs leading-relaxed text-[#6d625a]">{event.tagline}</p>
        </div>

        {/* Venue and Time metadata */}
        <div className="space-y-1 text-xs text-[#6d625a]">
          <div className="flex items-center gap-2">
            <span className="w-16 text-[#8c7b6c]">Location</span>
            <span className="truncate text-right">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-[#8c7b6c]">Date</span>
            <span>{formatShortDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-[#8c7b6c]">Time</span>
            <span>{event.time}</span>
          </div>
        </div>

        <Link
          href={`/event/${event.id}`}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#171617] py-2.5 text-xs font-semibold text-white transition hover:bg-[#6b4a2c]"
        >
          Register
        </Link>
      </div>
    </article>
  );
}