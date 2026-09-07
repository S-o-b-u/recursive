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
  devfolioUrl: "https://recursiveacm.devfolio.co",
  devfolioSlug: "recursiveacm", // Replace with your verified Devfolio hackathon slug (e.g. "recursive")
  devfolioTheme: "light" as "light" | "dark" | "dark-inverted",
  proposalTemplateUrl: "https://docs.google.com/presentation/d/1hWmofLq_oe_ZI_n_gTTszlc0AqkJIQyhz1n0iyBXEO8/copy", // Official Idea Submission PPT Template
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

/**
 * The venue, in one place.
 *
 * The coordinates were previously written out three times and disagreed with
 * each other: the map embed pinned 22.6997,88.3792 while the panel beside it
 * printed 22.6907, and neither matched the campus -- the pin sat roughly half a
 * kilometre north-east of it, in Panihati rather than on Nilgunj Road. These
 * are the campus coordinates as recorded by Wikidata (Q5620408) and Wikipedia.
 * Anything that shows a map, prints a coordinate, or emits Place schema reads
 * from here.
 */
export const VENUE = {
  name: "Guru Nanak Institute of Technology",
  streetAddress: "157/F, Nilgunj Road, Sahid Colony, Panihati",
  locality: "Sodepur, Kolkata",
  region: "West Bengal",
  postalCode: "700114",
  country: "IN",
  lat: 22.695132695547784,
  lng: 88.37877130486947,
  /** As displayed to a reader. */
  display: "22.6951° N, 88.3788° E",
  get full() {
    return `${this.streetAddress}, ${this.locality}, ${this.region} ${this.postalCode}`;
  },
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
 * Six themes.
 */
export const TRACKS: Track[] = [
  {
    slug: "ai-intelligent-systems",
    title: "AI & Intelligent Systems",
    seat: "Seat 01",
    line: "Kill the wrapper. Build intelligence that actually thinks, reasons, and executes.",
    media: { label: "AI & Intelligent Systems", expect: "/images/themes/ai.jpg", src: "/images/themes/ai.jpg" },
    summary:
      "Stop building glorified prompt wrappers. Engineer multi-agent swarms, local edge models running with zero latency, autonomous execution loops, and neuro-symbolic engines that solve deep real-world chaos.",
    prompts: [
      "Autonomous agent swarms executing real-world action loops",
      "Sub-second edge AI and zero-cloud local reasoning engines",
      "Neuro-symbolic pipelines that eradicate hallucinations",
    ],
  },
  {
    slug: "fintech-digital-innovation",
    title: "FinTech & Digital Innovation",
    seat: "Seat 02",
    line: "Hack the velocity of money. Code capital that moves at the speed of light.",
    media: { label: "FinTech & Digital Innovation", expect: "/images/themes/finance.jpg", src: "/images/themes/finance.jpg" },
    summary:
      "Re-engineer how billions flow. Build algorithmic financial copilots, zero-knowledge fraud shields, flash-settlement escrow protocols, and micro-wealth engines that democratize global capital.",
    prompts: [
      "Autonomous AI financial agents executing split-second alpha",
      "Zero-knowledge fraud shields and instant borderless settlements",
      "Smart programmable escrow and next-gen creator economy rails",
    ],
  },
  {
    slug: "healthtech-wellness",
    title: "HealthTech & Wellness",
    seat: "Seat 03",
    line: "Hardware for heartbeat, software for survival. Hack the human machine.",
    media: { label: "HealthTech & Wellness", expect: "/images/themes/heart.jpg", src: "/images/themes/heart.jpg" },
    summary:
      "Where silicon meets biology. Engineer real-time bio-telemetry, AI diagnostic sentinels that catch illness before symptoms show, sensory accessibility gear, and mental wellness tools backed by hard neuroscience.",
    prompts: [
      "Real-time biometric telemetry and predictive early-warning sensors",
      "Neural and tactile assistive tech breaking physical barriers",
      "Cognitive wellness engines grounded in behavioral neuroscience",
    ],
  },
  {
    slug: "cybersecurity-digital-trust",
    title: "Cybersecurity & Digital Trust",
    seat: "Seat 04",
    line: "Zero trust. Zero compromises. Defend the digital citadel before it burns.",
    media: { label: "Cybersecurity & Digital Trust", expect: "/images/themes/cyber.jpg", src: "/images/themes/cyber.jpg" },
    summary:
      "Break in or lock down. Forge unbreakable cryptographic perimeters, eBPF kernel sentinels, autonomous exploit self-healers, and zero-knowledge identity vaults that withstand nation-state attacks.",
    prompts: [
      "Zero-knowledge proofs and tamper-proof cryptographic identity vaults",
      "Autonomous eBPF kernel guardians that kill zero-day exploits live",
      "Self-healing code sandboxes that patch vulnerabilities on the fly",
    ],
  },
  {
    slug: "web3-blockchain",
    title: "Web3 & Blockchain",
    seat: "Seat 05",
    line: "Decentralize everything. Uncensorable code, trustless consensus, and sovereign ownership.",
    media: { label: "Web3 & Blockchain", expect: "/images/themes/web3.jpg", src: "/images/themes/web3.jpg" },
    summary:
      "Ditch the middlemen. Architect hyper-scalable dApps, cross-chain liquidity networks, decentralized physical infrastructure (DePIN), and unstoppable smart contracts that return ownership to the builders.",
    prompts: [
      "DePIN networks bridging physical hardware with decentralized incentives",
      "High-throughput smart contracts and gasless cross-chain bridges",
      "Self-sovereign identity and censorship-resistant decentralized protocols",
    ],
  },
  {
    slug: "open-innovation",
    title: "Open Innovation",
    seat: "Seat 06",
    line: "No guardrails. No blueprints. The raw 4 AM obsession you can't stop coding.",
    media: { label: "Open Innovation", expect: "/images/themes/openinvo.jpg", src: "/images/themes/openinvo.jpg" },
    summary:
      "The wildcard arena for pure technical rebellion. Bizarre hardware hacks, brain-computer interfaces, mind-bending developer tools, and audacious experiments that defy every neat category.",
    prompts: [
      "Radical spatial computing and mind-bending human-computer interfaces",
      "Unapologetic dev tools that supercharge builder craft 10x",
      "Crazy hardware hacks and unclassifiable high-risk experiments",
    ],
  },
];

export const TRACK_CRITERIA: Record<string, string[]> = {
  "ai-intelligent-systems": [
    "Cognitive Depth — novel architectures, robust agent loops, or fine-tuned reasoning",
    "Practical Utility — solves genuine complexity beyond simple prompt wrappers",
    "Execution & Latency — fluid streaming, graceful fallback, and responsive interaction",
  ],
  "fintech-digital-innovation": [
    "Security & Integrity — robust handling of transactions, edge cases, and state",
    "Economic Utility — tangible improvement in accessibility, cost, or clarity",
    "User Experience — simplifying complex financial flows into intuitive interfaces",
  ],
  "healthtech-wellness": [
    "Clinical & Human Impact — thoughtful consideration of empathy, accessibility, and care",
    "Data Privacy & Precision — reliable telemetry and private handling of sensitive signals",
    "Experience Polish — clean, stress-free interaction design for critical moments",
  ],
  "cybersecurity-digital-trust": [
    "Cryptographic Rigor — sound threat modeling and sound security architecture",
    "Resilience & Hardening — defense against adversarial attacks and edge cases",
    "Operational Ergonomics — security that empowers users without friction",
  ],
  "web3-blockchain": [
    "Decentralization & Security — sound smart contract design, trustless architecture, and reentrancy defense",
    "On-Chain Utility & Ergonomics — seamless UX, gas efficiency, and genuine real-world application",
    "Technical Architecture — innovative protocol design, cross-chain logic, or state management",
  ],
  "climatetech-sustainability": [
    "Ecological Impact — practical utility for conservation, efficiency, or restoration",
    "Data Legibility — transforming complex environmental datasets into clarity",
    "System Feasibility — real-world viability, low-power or offline capability",
  ],
  "open-innovation": [
    "Uncompromising Originality — ideas that break conventional hackathon molds",
    "Technical Execution — turning an unconventional premise into working code",
    "Demo Polish — immediate, captivating presentation on stage",
  ],
};

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
  note: "One award per track — six in total.",
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
    q: "How do I apply, and what is the idea submission process?",
    a: "Applying for Recursive is done via Devfolio with an idea review round:\n\n1. Register on Devfolio: Click the 'Apply with Devfolio' button and complete your profile. You can apply solo or form a team of 1 to 4 members.\n2. Download the Idea Template: Access the official [Recursive ACM Idea Submission Template](https://docs.google.com/presentation/d/1hWmofLq_oe_ZI_n_gTTszlc0AqkJIQyhz1n0iyBXEO8/copy) on Google Slides.\n3. Prepare Your Proposal: Fill out the slides with your problem statement, target track, technical architecture, and impact.\n4. Export as PDF & Upload: Save your completed deck as a PDF (max 5–6 slides) and upload it directly in your Devfolio application form before registration closes.\n5. Review & RSVP: Applications will be reviewed by the organizing committee. Shortlisted teams will receive an acceptance invitation on Devfolio and email to confirm their attendance (RSVP) for the in-person hackathon at GNIT.",
  },
  {
    q: "What should be included in our Idea Submission PPT?",
    a: "Keep your presentation concise and impactful (5 to 6 slides). We recommend following this structure:\n\n• Slide 1 — Team & Track: Team name, members, college, contact info, and chosen track.\n• Slide 2 — Problem Statement: The real-world friction, inefficiency, or challenge you aim to solve.\n• Slide 3 — Proposed Solution: Your approach, key features, and core innovation.\n• Slide 4 — System Architecture & Stack: Software frameworks, databases, external APIs, ML models, or hardware components.\n• Slide 5 — 8-Hour Execution Plan: Minimum Viable Product (MVP) scope to be built and demonstrated live on stage.",
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
