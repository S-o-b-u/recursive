/**
 * Single source of truth for hackathon content.
 * Home-page sections and the dedicated detail pages both read from here, so
 * copy only ever needs editing in one place.
 */

export const EVENT = {
  name: "RECURSIVE",
  tagline: "Where ideas branch, evolve, and bloom.",
  edition: "Hackathon 2026",
  dates: "March 20 – 22, 2026",
  duration: "36 hours",
  format: "In person · Kolkata, India",
  venue: "To be announced",
  teamSize: "1 – 4 builders",
  seats: 4, // the four chairs on the hill
  // TODO: swap in the real links before launch.
  devfolioUrl: "#",
  discordUrl: "#",
  email: "team@recursive.dev",
  socials: {
    x: "#",
    instagram: "#",
    github: "#",
    linkedin: "#",
  },
} as const;

export type Track = {
  slug: string;
  title: string;
  seat: string;
  summary: string;
  prompts: string[];
};

/** Four tracks — one for each chair on the hill. */
export const TRACKS: Track[] = [
  {
    slug: "generative-nature",
    title: "Generative Nature",
    seat: "Seat 01",
    summary:
      "Systems that grow. Recursion, L-systems, cellular automata, agents that evolve their own rules — anything where a simple instruction repeated becomes something beautiful.",
    prompts: [
      "Procedural worlds that never repeat",
      "Creative tools built on generative grammars",
      "Agentic pipelines that refine their own output",
    ],
  },
  {
    slug: "climate-regeneration",
    title: "Climate & Regeneration",
    seat: "Seat 02",
    summary:
      "Software for the living world. Measure, restore, or protect — from soil sensors to supply-chain transparency to tools that make climate data legible.",
    prompts: [
      "Making emissions data actually usable",
      "Community tooling for restoration projects",
      "Low-power sensing for farms and forests",
    ],
  },
  {
    slug: "open-web",
    title: "Open Web & Dev Tools",
    seat: "Seat 03",
    summary:
      "Sharpen the tools everyone builds with. Compilers, debuggers, protocols, editors, local-first sync — infrastructure that other people's ideas can root into.",
    prompts: [
      "Local-first apps that survive the network",
      "Developer experience nobody has fixed yet",
      "Protocols for a less centralised web",
    ],
  },
  {
    slug: "wildcard",
    title: "Wildcard",
    seat: "Seat 04",
    summary:
      "Anything that grows. If it doesn't fit a track but it made you stay up until 4am, it belongs here. Judged on originality and craft, nothing else.",
    prompts: [
      "The idea you couldn't stop thinking about",
      "Hardware, games, art, weird interfaces",
      "Something genuinely new",
    ],
  },
];

export type ScheduleDay = {
  day: string;
  date: string;
  items: { time: string; title: string; note?: string }[];
};

export const SCHEDULE: ScheduleDay[] = [
  {
    day: "Day 01",
    date: "Friday, March 20",
    items: [
      { time: "09:00", title: "Check-in & breakfast", note: "Badges, swag, and the first coffee." },
      { time: "10:30", title: "Opening ceremony", note: "Tracks, rules, and judging criteria." },
      { time: "12:00", title: "Hacking begins", note: "The clock starts. 36 hours." },
      { time: "15:00", title: "Workshop — Generative systems", note: "Hands-on, beginner friendly." },
      { time: "20:00", title: "Dinner & team mixer", note: "Still looking for a team? Come here." },
      { time: "23:30", title: "Midnight snacks" },
    ],
  },
  {
    day: "Day 02",
    date: "Saturday, March 21",
    items: [
      { time: "08:00", title: "Breakfast" },
      { time: "11:00", title: "Mentor rounds", note: "Every team gets a 20-minute slot." },
      { time: "14:00", title: "Workshop — Shipping fast", note: "Deploys, demos, and dead ends." },
      { time: "18:00", title: "Checkpoint demos", note: "Two minutes, no slides." },
      { time: "21:00", title: "Dinner & lightning talks" },
      { time: "02:00", title: "Late-night quiet hours", note: "Rest area opens." },
    ],
  },
  {
    day: "Day 03",
    date: "Sunday, March 22",
    items: [
      { time: "08:00", title: "Breakfast" },
      { time: "12:00", title: "Submissions close", note: "Hard deadline on Devfolio." },
      { time: "13:00", title: "Expo & judging", note: "Judges walk the floor." },
      { time: "16:00", title: "Finalist presentations", note: "Top six on the main stage." },
      { time: "17:30", title: "Closing & prizes" },
    ],
  },
];

export type Prize = {
  place: string;
  amount: string;
  title: string;
  perks: string[];
  featured?: boolean;
};

export const PRIZES: Prize[] = [
  {
    place: "Runner-up",
    amount: "₹75,000",
    title: "Second place",
    perks: ["Cash prize", "Mentorship sessions", "Cloud credits"],
  },
  {
    place: "Winner",
    amount: "₹1,50,000",
    title: "Grand prize",
    perks: ["Cash prize", "Incubation interview", "Hardware kits", "Cloud credits"],
    featured: true,
  },
  {
    place: "Third place",
    amount: "₹40,000",
    title: "Third place",
    perks: ["Cash prize", "Cloud credits"],
  },
];

export const TRACK_PRIZE = {
  amount: "₹25,000",
  label: "Best in each track",
  note: "One award per seat — four in total.",
};

export const SPECIAL_PRIZES = [
  { title: "Best first-time hacker", note: "For a team where everyone is at their first hackathon." },
  { title: "Best design", note: "Craft, typography, motion — the details." },
  { title: "Most beautiful failure", note: "The ambitious idea that didn't quite compile." },
  { title: "Community choice", note: "Voted by everyone in the room." },
];

export type Sponsor = { name: string; tier: "Canopy" | "Grove" | "Sapling"; url?: string };

export const SPONSORS: Sponsor[] = [
  { name: "Your brand here", tier: "Canopy" },
  { name: "Your brand here", tier: "Canopy" },
  { name: "Your brand here", tier: "Grove" },
  { name: "Your brand here", tier: "Grove" },
  { name: "Your brand here", tier: "Grove" },
  { name: "Your brand here", tier: "Sapling" },
  { name: "Your brand here", tier: "Sapling" },
  { name: "Your brand here", tier: "Sapling" },
];

export const SPONSOR_TIERS = [
  {
    tier: "Canopy",
    price: "₹5,00,000",
    perks: ["Title billing on all assets", "Keynote slot", "Dedicated track & prize", "Recruiting booth", "10 mentor passes"],
  },
  {
    tier: "Grove",
    price: "₹2,00,000",
    perks: ["Logo on stage & site", "Workshop slot", "Recruiting table", "5 mentor passes"],
  },
  {
    tier: "Sapling",
    price: "₹75,000",
    perks: ["Logo on site", "Swag in every bag", "2 mentor passes"],
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Who can participate?",
    a: "Any student or early-career builder, anywhere. Bring a college ID or a short note about what you're working on. Absolute beginners are genuinely welcome — roughly a third of our seats are held for first-timers.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. Entry, food, and workspace are free for everyone accepted. Travel reimbursement is available for a limited number of teams travelling more than 300km — apply during registration.",
  },
  {
    q: "Do I need a team?",
    a: "No. Come alone and find one at the Friday mixer, or register with up to three friends. Teams are capped at four people — one per chair.",
  },
  {
    q: "Can I start building before the event?",
    a: "No. Everything you submit must be written during the 36 hours. You can arrive with an idea, sketches, research, and a plan — that's encouraged. Boilerplate and open-source libraries are fine; a half-finished project is not.",
  },
  {
    q: "What should I bring?",
    a: "Laptop, charger, ID, a change of clothes, and anything unusual your project needs. We provide power, wifi, food, water, and a quiet place to sleep.",
  },
  {
    q: "How is judging done?",
    a: "Four criteria, weighted equally: originality, technical depth, craft, and how well you tell the story. Judges walk the expo floor, then the top six present on the main stage.",
  },
  {
    q: "Do I keep my IP?",
    a: "Yes. Your project is yours. We only ask permission to show it in the recap and on this site.",
  },
  {
    q: "Is there a code of conduct?",
    a: "Yes, and we enforce it. Read it before you register — it's short and it matters.",
  },
];

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Tracks", href: "/tracks" },
  { label: "Schedule", href: "/schedule" },
  { label: "Prizes", href: "/prizes" },
  { label: "FAQ", href: "/faq" },
];
