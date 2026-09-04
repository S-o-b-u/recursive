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
  devfolioUrl: "https://devfolio.co",
  devfolioSlug: "recursive", // Replace with your verified Devfolio hackathon slug (e.g. "recursive")
  devfolioTheme: "light" as "light" | "dark" | "dark-inverted",
  sponsorUrl: "https://forms.gle/6WMzt855AmDqDUac8",
  discordUrl: "https://discord.gg/SMYB7tJQf",
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
  { label: "DEVFOLIO LOGO", expect: "/images/devfolio.png", src: "/images/devfolio.png" },
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
    day: "Hackathon Day",
    date: "Thursday, October 8, 2026",
    items: [
      { time: "09:00", title: "Check-in & Registration", note: "Collect your badges, swag kits, and morning refreshments." },
      { time: "09:45", title: "Opening Ceremony & Track Briefing", note: "Welcome by GNIT ACM Chapter, track deep dive, and rules breakdown." },
      { time: "10:30", title: "Hacking Begins (8-Hour Sprint)", note: "The clock starts. Brainstorm, design, and code." },
      { time: "13:00", title: "Lunch & Mentor Walkthrough", note: "Fuel up and receive 1-on-1 technical feedback from mentors." },
      { time: "16:00", title: "Mid-Sprint Checkpoint & Snacks", note: "Progress sync, coffee break, and debugging assistance." },
      { time: "18:30", title: "Submissions Close & Hacking Ends", note: "Final commit, push repositories, and submit project demos on Devfolio." },
      { time: "18:45", title: "Live Demos & Expo Judging", note: "Teams present their working prototypes to the panel of judges." },
      { time: "20:00", title: "Award Ceremony & Closing", note: "Winner announcements, prize distribution, and closing remarks." },
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
    q: "What is Recursive and who is organizing it?",
    a: "Recursive is the inaugural flagship 8-hour in-person hackathon hosted by the GNIT ACM Student Chapter in collaboration with the Department of Information Technology at Guru Nanak Institute of Technology (GNIT), Kolkata. It brings together developers, designers, and builders for eight hours of rapid prototyping, honest software craft, and collaborative problem-solving.",
  },
  {
    q: "Who is eligible to participate?",
    a: "Any undergraduate, postgraduate, or diploma student is eligible to participate. You will need to carry a valid college ID card, or a government ID proof (Aadhaar, PAN, voter ID, passport, or driving licence) if you cannot present one. Whether you are an experienced builder or attending your very first hackathon, beginners are warmly welcome—mentors will be on the floor throughout the event to help you.",
  },
  {
    q: "Is there any registration fee?",
    a: "No. Recursive is 100% free of cost. Admission, high-speed Wi-Fi access, meals, snacks, beverages, exclusive swag kits, and mentorship are provided completely free to all shortlisted participants.",
  },
  {
    q: "What is the team size and can I apply solo?",
    a: "Teams can consist of 1 to 4 members. You can register with a pre-formed team or apply solo. If you join alone, you can connect with other builders during the morning team-matching mixer before hacking kicks off.",
  },
  {
    q: "Where is the venue and what is the schedule?",
    a: "The hackathon takes place in person at Guru Nanak Institute of Technology (GNIT), Sodepur, Kolkata. Check-in starts at 9:00 AM, the official 8-hour hacking sprint runs from 10:30 AM to 6:30 PM, followed immediately by project demos, judging, and the award ceremony.",
  },
  {
    q: "Can I work on a pre-existing project or start early?",
    a: "No. All code and designs must be created during the official 8-hour hacking window. You are encouraged to come with ideas, sketches, and plans, and you may use open-source libraries, public APIs, and frameworks, but writing core application code beforehand is strictly prohibited.",
  },
  {
    q: "What should I bring on the day of the event?",
    a: "Please bring your laptop, charger, power strip/extension cord, a valid college ID card (or government ID proof if you don't have one), and any specific hardware components your project might require. High-speed campus Wi-Fi, dedicated power stations, meals, and snacks will be provided throughout the day.",
  },
  {
    q: "How will projects be evaluated and what are the prizes?",
    a: "Projects will be evaluated by industry judges and academic mentors based on four core criteria: technical depth, problem innovation, design/UX craft, and the quality of your live demo. Cash prizes, track awards, certificates, and sponsor perks will be awarded to top teams.",
  },
];

export const NAV_LINKS = [
  { label: "The chair", href: "/#about" },
  { label: "Themes", href: "/#themes" },
  { label: "Judges", href: "/#judges" },
  { label: "Sponsors", href: "/#sponsors" },
  { label: "FAQ", href: "/#faq" },
];
