export type EventItem = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export const events: EventItem[] = [
  {
    id: "tech-innovators-meetup",
    name: "Tech Innovators Meetup",
    date: "2026-09-12",
    time: "10:00 AM",
    location: "Victoria Island, Lagos",
    description: "A focused meetup for builders, founders, and product teams.",
  },
  {
    id: "startup-pitch-night",
    name: "Startup Pitch Night",
    date: "2026-09-18",
    time: "6:30 PM",
    location: "Yaba, Lagos",
    description: "Pitch your startup, meet investors, and network with peers.",
  },
  {
    id: "university-workshop-day",
    name: "University Workshop Day",
    date: "2026-09-25",
    time: "9:00 AM",
    location: "University of Lagos",
    description: "A practical workshop day for students and young professionals.",
  },
];

export function formatEventDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

export function formatDisplayDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}