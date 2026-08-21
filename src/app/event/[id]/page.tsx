import { notFound } from "next/navigation";
import { events } from "@/lib/utils";
import { RegistrationForm } from "@/components/RegistrationForm";

type EventPageProps = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = params;
  const event = events.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-600">Register</p>
          <h1 className="text-2xl font-semibold text-zinc-900">{event.name}</h1>
          <div className="space-y-1 text-sm text-zinc-600">
            <p>{event.date}</p>
            <p>{event.time}</p>
            <p>{event.location}</p>
          </div>
        </div>

        <RegistrationForm
          eventId={event.id}
          eventName={event.name}
          eventDate={event.date}
          eventTime={event.time}
          eventLocation={event.location}
        />
      </section>
    </main>
  );
}