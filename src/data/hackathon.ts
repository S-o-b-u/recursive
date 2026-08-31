/**
 * Single source of truth for hackathon content.
 * Home-page sections and the dedicated detail pages both read from here, so
 * copy only ever needs editing in one place.
 */

export const EVENT = {
  name: "RECURSIVE",
  tagline: "Build something that matters.",
  edition: "Hackathon 2026",
  dates: "October 8, 2026",
  startsAt: "2026-10-08T09:00:00+05:30",
  duration: "8 hours",
  format: "In person · Sodepur, Kolkata",
  venue: "Guru Nanak Institute of Technology",
  teamSize: "1 – 4 builders",
  seats: 4, // the four chairs on the hill
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

/**
 * A media placeholder. Drop the real file into `/public` at `expect`, then set
 * `src` to that same path — the slot swaps from placeholder to real media.
 */
export type Slot = {
  label: string;
  expect: string;
  src?: string;
  kind?: "image" | "video";
};

/**
 * The chapter and college running the event.
 */
export const COLLEGE = {
  chapter: "ACM Student Chapter",
  collaboration: "Department of Information Technology",
  college: "Guru Nanak Institute of Technology",
  collegeShort: "GNIT",
  city: "Sodepur, Kolkata",
  acmFounded: "1947",
} as const;

/** College / chapter logos. */
export const COLLEGE_LOGOS: Slot[] = [
  { label: "GNIT ACM Student Chapter", expect: "/college_logo/gnitacm.png", src: "/college_logo/gnitacm.png" },
];

export type Track = {
  slug: string;
  title: string;
  seat: string;
  /** One line. This is what the home-page themes grid shows. */
  line: string;
  /** Cover art or clip for the themes grid. */
  media: Slot;
  summary: string;
  prompts: string[];
};

/**
 * Four themes.
 * TODO: these are placeholders — replace the titles and lines with the real
 * themes once they are locked.
 */
export const TRACKS: Track[] = [
  {
    slug: "generative-nature",
    title: "Generative Nature",
    seat: "Seat 01",
    line: "Simple rules, repeated, until something grows.",
    media: { label: "Generative Nature", expect: "/images/themes/generative.jpg", src: "" },
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
    line: "Software for soil, air, water and the people counting it.",
    media: { label: "Climate & Regeneration", expect: "/images/themes/climate.jpg", src: "" },
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
    line: "Sharpen the tools the rest of us build with.",
    media: { label: "Open Web & Dev Tools", expect: "/images/themes/openweb.jpg", src: "" },
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
    line: "The idea that kept you up. Bring that one.",
    media: { label: "Wildcard", expect: "/images/themes/wildcard.mp4", src: "", kind: "video" },
    summary:
      "Anything that grows. If it doesn't fit a track but it made you stay up until 4am, it belongs here. Judged on originality and craft, nothing else.",
    prompts: [
      "The idea you couldn't stop thinking about",
      "Hardware, games, art, weird interfaces",
      "Something genuinely new",
    ],
  },
];

/**
 * Judges. No names until they confirm — fill `name`/`role` and the photo `src`
 * as each one says yes.
 */
export type Judge = { name: string; role: string; photo: Slot };

export const JUDGES: Judge[] = [
  { name: "", role: "", photo: { label: "Judge 01", expect: "/images/judges/01.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 02", expect: "/images/judges/02.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 03", expect: "/images/judges/03.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 04", expect: "/images/judges/04.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 05", expect: "/images/judges/05.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 06", expect: "/images/judges/06.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 07", expect: "/images/judges/07.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 08", expect: "/images/judges/08.jpg", src: "" } },
  { name: "", role: "", photo: { label: "Judge 09", expect: "/images/judges/09.jpg", src: "" } },
];

/** Sponsor logo wall. Add a slot per signed sponsor, drop the logo in, set `src`. */
export const SPONSOR_SLOTS: Slot[] = [
  { label: "Sponsor 01", expect: "/images/sponsors/01.svg", src: "" },
  { label: "Sponsor 02", expect: "/images/sponsors/02.svg", src: "" },
  { label: "Sponsor 03", expect: "/images/sponsors/03.svg", src: "" },
  { label: "Sponsor 04", expect: "/images/sponsors/04.svg", src: "" },
  { label: "Sponsor 05", expect: "/images/sponsors/05.svg", src: "" },
  { label: "Sponsor 06", expect: "/images/sponsors/06.svg", src: "" },
  { label: "Sponsor 07", expect: "/images/sponsors/07.svg", src: "" },
  { label: "Sponsor 08", expect: "/images/sponsors/08.svg", src: "" },
];

export type ScheduleDay = {
  day: string;
  date: string;
  items: { time: string; title: string; note?: string }[];
};

export const SCHEDULE: ScheduleDay[] = [
  {
    day: "Day 01",
    date: "Thursday, October 8",
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
    date: "Friday, October 9",
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
    date: "Saturday, October 10",
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
  { label: "The chair", href: "/#about" },
  { label: "Themes", href: "/#themes" },
  { label: "Judges", href: "/#judges" },
  { label: "Sponsors", href: "/#sponsors" },
  { label: "FAQ", href: "/#faq" },
];
