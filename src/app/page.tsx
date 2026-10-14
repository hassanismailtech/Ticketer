import { INITIAL_EVENTS } from "@/lib/events-data";
import { EventCard } from "@/components/EventCard";
import Image from "next/image";

export default function HomePage() {
  const featuredEvent = INITIAL_EVENTS[0];

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#bd7a12]">Ticketer by HIT.DEV</p>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-[#171617] sm:text-6xl">
            Find your next room to be in.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6d625a]">
            Discover thoughtful gatherings, reserve a place in seconds, and keep your secure pass in one calm account.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#6b4a2c]">
            {['All events', 'Technology', 'Founders', 'Arts'].map((category, index) => (
              <span key={category} className={`rounded-full border px-3 py-2 ${index === 0 ? 'border-[#171617] bg-[#171617] text-white' : 'border-[#d9d0c8] bg-white'}`}>{category}</span>
            ))}
          </div>
        </div>

        <article className="relative min-h-[260px] overflow-hidden rounded-2xl bg-[#171617] shadow-[0_18px_45px_rgba(93,63,33,0.18)]">
          <Image src={featuredEvent.bannerUrl} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-65" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171617] via-[#171617]/35 to-transparent" />
          <div className="relative flex min-h-[260px] flex-col justify-end p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3c875]">Featured gathering</p>
            <h2 className="mt-2 max-w-md text-2xl font-bold leading-tight">{featuredEvent.title}</h2>
            <p className="mt-2 text-xs text-white/75">{featuredEvent.location} · {featuredEvent.date}</p>
          </div>
        </article>
      </section>

      <section id="events" className="mt-14">
        <div className="mb-5 flex items-end justify-between border-b border-[#e7e1dc] pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#bd7a12]">The calendar</p>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#171617]">Events worth showing up for</h2>
          </div>
          <p className="hidden text-xs text-[#6d625a] sm:block">{INITIAL_EVENTS.length} curated events</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
        {INITIAL_EVENTS.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      </section>
    </main>
  );
}