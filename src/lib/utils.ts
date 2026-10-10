import { INITIAL_EVENTS, UnicornEvent, formatEventDate, formatShortDate } from "./events-data";

export type EventItem = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

// Legacy compatibility mapping
export const events: EventItem[] = INITIAL_EVENTS.map((e) => ({
  id: e.id,
  name: e.title,
  date: e.date,
  time: e.time,
  location: `${e.venue}, ${e.location}`,
  description: e.description,
}));

export function formatDisplayDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export { formatEventDate, formatShortDate };