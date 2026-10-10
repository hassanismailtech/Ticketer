export interface EventTierData {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  soldCount: number;
  color: string;
  perks: string[];
}

export interface UnicornEvent {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "Technology" | "Music & Arts" | "Founders & Venture" | "Design & AI";
  bannerUrl: string;
  location: string;
  venue: string;
  date: string;
  time: string;
  capacity: number;
  soldCount: number;
  status: "PUBLISHED" | "SOLD_OUT" | "DRAFT";
  isFeatured: boolean;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tiers: EventTierData[];
}

export const INITIAL_EVENTS: UnicornEvent[] = [
  {
    id: "synapse-ai-summit-2026",
    slug: "synapse-ai-summit-2026",
    title: "SYNAPSE 2026: Global AI & Autonomous Systems Summit",
    tagline: "The frontier conference for autonomous agents, neural architectures, and enterprise AI scale.",
    description: "Join 1,200+ top artificial intelligence researchers, founders, and infrastructure architects. Experience live interactive demos of frontier agentic swarms, real-time edge intelligence, and participate in closed-door venture roundtables.",
    category: "Technology",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    location: "Victoria Island, Lagos",
    venue: "Grand Horizon Ballroom & Tech Hub",
    date: "2026-11-14",
    time: "09:00 AM - 06:00 PM WAT",
    capacity: 1200,
    soldCount: 940,
    status: "PUBLISHED",
    isFeatured: true,
    organizer: {
      name: "Synapse Labs Global",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    tiers: [
      {
        id: "tier-synapse-ga",
        name: "General Admission",
        description: "Full access to keynotes, research tracks, and exhibit hall.",
        price: 0,
        capacity: 900,
        soldCount: 780,
        color: "#6366f1",
        perks: ["Access to main stage & research tracks", "Live demo arena admission", "Digital attendee bag & materials", "Networking coffee breaks"],
      },
      {
        id: "tier-synapse-vip",
        name: "VIP All-Access Pass",
        description: "Priority front-row seating, Speaker Lounge, and Private Dinner.",
        price: 150,
        capacity: 300,
        soldCount: 160,
        color: "#f59e0b",
        perks: ["Front-row reserved seating", "Exclusive Speaker & VC Lounge access", "Private networking cocktail dinner", "Fast-track Gate 1 VIP check-in", "Executive gift box"],
      },
    ],
  },
  {
    id: "nexus-electronic-spatial-fest",
    slug: "nexus-electronic-spatial-fest",
    title: "NEXUS: Spatial Audio & Visual Arts Experience",
    tagline: "An audiovisual odyssey combining 360-degree spatial soundscapes and immersive lasers.",
    description: "A multisensory electronic music festival featuring world-renowned ambient and electronic producers performing on a custom 32-channel spatial audio array with synchronized architectural projection mapping.",
    category: "Music & Arts",
    bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    location: "Eko Atlantic Waterfront, Lagos",
    venue: "The Ocean Stage & Arena",
    date: "2026-11-28",
    time: "07:00 PM - 03:00 AM WAT",
    capacity: 3500,
    soldCount: 2890,
    status: "PUBLISHED",
    isFeatured: true,
    organizer: {
      name: "Nexus Sound Collective",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    tiers: [
      {
        id: "tier-nexus-ga",
        name: "General Wave Ticket",
        description: "Standard entry to all sound arenas and interactive art installations.",
        price: 25,
        capacity: 3000,
        soldCount: 2520,
        color: "#06b6d4",
        perks: ["Entry to Ocean Stage", "Interactive visual pavilion access", "Waterfront food & beverage village"],
      },
      {
        id: "tier-nexus-backstage",
        name: "Backstage & Artist Deck",
        description: "Elevated viewing deck, artist bar, and private sanitary facilities.",
        price: 120,
        capacity: 500,
        soldCount: 370,
        color: "#ec4899",
        perks: ["Elevated backstage viewing platform", "Private craft bar & complimentary drinks", "Dedicated expedited entrance", "Artist lounge mingling"],
      },
    ],
  },
  {
    id: "founders-venture-soiree-2026",
    slug: "founders-venture-soiree-2026",
    title: "Founders & Angels High-Growth Soirée",
    tagline: "Curated matchmaking evening connecting Series A/B founders with institutional angels.",
    description: "An invite-only, high-trust gathering of 150 top venture-backed founders and active angel syndicates. High-velocity breakout chats, no slide decks, just candid business conversations and portfolio synergy.",
    category: "Founders & Venture",
    bannerUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    location: "Ikoyi, Lagos",
    venue: "The Penthouse Terrace at Skyview",
    date: "2026-12-05",
    time: "06:30 PM - 11:00 PM WAT",
    capacity: 150,
    soldCount: 132,
    status: "PUBLISHED",
    isFeatured: false,
    organizer: {
      name: "Venture Syndicate Africa",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      verified: true,
    },
    tiers: [
      {
        id: "tier-founders-invite",
        name: "Founder Access Pass",
        description: "For active tech founders building scalable products.",
        price: 0,
        capacity: 100,
        soldCount: 92,
        color: "#10b981",
        perks: ["Private rooftop dining & champagne", "VC pitch breakout sessions", "Investor contact directory", "Confidential founder mastermind"],
      },
      {
        id: "tier-angels-partner",
        name: "Investor & Partner Ticket",
        description: "For fund managers, family offices, and verified angels.",
        price: 200,
        capacity: 50,
        soldCount: 40,
        color: "#8b5cf6",
        perks: ["Deal pipeline dossier access", "Private syndicate lounge", "Rooftop dining with founders", "Priority deal co-investment slots"],
      },
    ],
  },
];

export function formatEventDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}
