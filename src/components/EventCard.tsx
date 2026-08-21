import Link from "next/link";
import { EventItem, formatDisplayDate } from "@/lib/utils";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-600">
            Event
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">{event.name}</h2>
        </div>
        <p className="text-sm leading-6 text-zinc-600">{event.description}</p>
        <dl className="space-y-2 text-sm text-zinc-700">
          <div className="flex items-start justify-between gap-4 border-t border-zinc-100 pt-3">
            <dt className="font-medium text-zinc-500">Date</dt>
            <dd className="text-right">{formatDisplayDate(event.date)}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-zinc-500">Time</dt>
            <dd className="text-right">{event.time}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-medium text-zinc-500">Location</dt>
            <dd className="text-right">{event.location}</dd>
          </div>
        </dl>
        <Link
          href={`/event/${event.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Register
        </Link>
      </div>
    </article>
  );
}