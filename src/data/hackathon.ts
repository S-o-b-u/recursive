/**
 * Single source of truth for hackathon content.
 * Home-page sections and the dedicated detail pages both read from here, so
 * copy only ever needs editing in one place.
 */

export const EVENT = {
  name: "RECURSIVE",
  tagline: "Where ideas branch, evolve, and bloom.",
  edition: "Hackathon 2026",
  dates: "October 8, 2026",
  startsAt: "2026-10-08T09:00:00+05:30",
  duration: "8 hours",
  format: "In person · Kolkata, India",
  venue: "Guru Nanak Institute of Technology, Kolkata",
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
 * The chapter running the event.
 */
export const COLLEGE = {
  chapter: "ACM Student Chapter",
  college: "Guru Nanak Institute of Technology",
  collegeShort: "GNIT",
  department: "Department of Information Technology",
  city: "Kolkata",
  acmFounded: "1947",
} as const;

/** College / chapter logos. */
export const COLLEGE_LOGOS: Slot[] = [
  { label: "GNIT", expect: "/images/gnit-logos/GNIT.png", src: "/images/gnit-logos/GNIT.png" },
  { label: "GNIT ACM Student Chapter", expect: "/images/gnit-logos/gnit-acm.png", src: "/images/gnit-logos/gnit-acm.png" },
  { label: "ACM", expect: "/images/gnit-logos/ACM2.png", src: "/images/gnit-logos/ACM2.png" },
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
    slug: "aiml",
    title: "AI & Machine Learning",
    seat: "Seat 01",
    line: "Autonomous intelligence, generative pipelines, and self-evolving models.",
    media: { label: "AI & Machine Learning", expect: "/images/themes/generative.jpg", src: "" },
    summary:
      "Build the next frontier of intelligence. Autonomous agentic pipelines, multimodal generative models, neural search, real-time computer vision, and systems that learn and adapt.",
    prompts: [
      "Autonomous Multi-Agent Workflows",
      "Multimodal Generative Creation Tools",
      "Edge AI & Real-time Neural Inference",
      "LLM Tooling & Automated Reasoning",
    ],
  },
  {
    slug: "cybersec",
    title: "CyberSecurity & Privacy",
    seat: "Seat 02",
    line: "Zero-trust defenses, cryptographic proofs, and resilient infrastructure.",
    media: { label: "CyberSecurity & Privacy", expect: "/images/themes/climate.jpg", src: "" },
    summary:
      "Fortify digital frontiers. Build zero-trust architectures, automated threat detection engines, zero-knowledge cryptographic systems, and privacy-preserving protocols.",
    prompts: [
      "Zero-Knowledge Proofs & Privacy Layers",
      "Automated Vulnerability & Threat Hunting",
      "Decentralized Identity & Auth Systems",
      "Next-Gen Network Security & Honeypots",
    ],
  },
  {
    slug: "fintech",
    title: "FinTech & Web3",
    seat: "Seat 03",
    line: "Decentralized liquidity, intelligent markets, and modern payments.",
    media: { label: "FinTech & Web3", expect: "/images/themes/openweb.jpg", src: "" },
    summary:
      "Rethink the velocity of value. Decentralized finance protocols, high-frequency algorithmic market tooling, biometric payment rails, and autonomous financial agents.",
    prompts: [
      "Smart Contract Auditing & Security",
      "Programmable Micro-Payments & Streams",
      "Decentralized Liquidity & Prediction Markets",
      "Fraud Detection with Graph Neural Nets",
    ],
  },
  {
    slug: "open-innovation",
    title: "Open Innovation",
    seat: "Seat 04",
    line: "Hardware hacking, biotech, wild ideas, and boundary-breaking craft.",
    media: { label: "Open Innovation", expect: "/images/themes/wildcard.mp4", src: "", kind: "video" },
    summary:
      "Anything that grows. BioTech, IoT & hardware, weird developer tools, sensory interfaces, or the idea that kept you up until 4am. Judged on pure creativity and engineering craft.",
    prompts: [
      "Hardware, IoT & Sensor Networks",
      "BioTech & Environmental Intelligence",
      "Novel Developer Tooling & Languages",
      "Experimental Games & Spatial Interfaces",
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
    day: "October 8",
    date: "Thursday, October 8, 2026",
    items: [
      { time: "09:00", title: "Check-in & breakfast", note: "Badges, swag, and the first coffee." },
      { time: "10:00", title: "Opening ceremony", note: "Tracks, problem statements, and judging criteria." },
      { time: "10:30", title: "Hacking begins", note: "The clock starts. 8-hour sprint." },
      { time: "13:30", title: "Lunch & checkpoint", note: "Fuel up and touch base with mentors." },
      { time: "16:30", title: "Mentor review rounds", note: "Floor feedback on working prototypes." },
      { time: "18:30", title: "Hacking ends & submission", note: "Hard deadline on Devfolio." },
      { time: "19:00", title: "Presentations & judging", note: "Project demos on the main stage." },
      { time: "20:00", title: "Closing & prizes", note: "Awards and celebrations." },
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
    a: "No. Everything you submit must be written during the 8 hours. You can arrive with an idea, sketches, research, and a plan — that's encouraged. Boilerplate and open-source libraries are fine; a half-finished project is not.",
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
];
