export type StarterIdea = {
  title: string;
  tagline: string;
  desc: string;
  stack: string[];
};

export type SprintPhase = {
  phase: string;
  hours: string;
  title: string;
  focus: string;
};

export type TrackDetail = {
  vision: string;
  whoShouldBuild: string;
  seatTitle: string;
  seatStory: string;
  starterIdeas: StarterIdea[];
  sprintPlaybook: SprintPhase[];
  theWinningEdge: string[];
  pitfallsToAvoid: string[];
  suggestedStack: string[];
  submissionTips: string[];
};

export const TRACK_DETAILS: Record<string, TrackDetail> = {
  "ai-intelligent-systems": {
    seatTitle: "The Architect's Chair · From Illusion to Agency",
    seatStory:
      "In the roadside tea stalls of Kolkata, arguments aren't settled by superficial opinions—they are debated down to first principles over steaming clay cups until the tea grows cold. Seat 01 demands that same unapologetic rigor for artificial intelligence. The era of thin prompt wrappers and fragile conversational parlor tricks is over. Pull up this chair if you believe true intelligence is an architectural loop: perceiving noisy, unstructured environments, planning deterministic actions, validating hypotheses against formal ground truth, and executing multi-step workflows at the edge. You are not building a chatbot here; you are engineering software that reasons, verifies, and acts with mathematical poise.",
    vision:
      "AI is evolving from passive next-token prediction into proactive, reasoning agentic networks, local edge intelligence, and neuro-symbolic systems. In this track, teams are challenged to forge systems that perceive, plan, verify, self-correct, and execute complex multi-step workflows with sub-second responsiveness, uncompromising precision, and deep architectural depth.",
    whoShouldBuild:
      "Systems programmers, ML engineers, autonomous agent architects, and full-stack tinkerers who despise hallucinated mockups and obsess over latency, evaluation pipelines, deterministic tool execution, and local inference models.",
    starterIdeas: [
      {
        title: "Autonomous Engineering Debugger & Trace Sentinel",
        tagline: "An active subagent that diagnoses and heals breaking builds in real time",
        desc: "A localized agent loop running alongside developer IDEs that instruments runtime errors, correlates distributed traces, tests potential AST patches in ephemeral Docker sandboxes, and verifies regression tests before proposing unified git diffs.",
        stack: ["vLLM / Ollama", "LangGraph", "Docker API", "TypeScript", "Tree-sitter AST"],
      },
      {
        title: "Neuro-Symbolic Legal & Medical Policy Verifier",
        tagline: "Formal logic constraints paired with LLM context comprehension",
        desc: "Combines high-speed transformer embeddings with deterministic SMT constraint solvers (Z3) to audit multi-thousand-page compliance documents and regulatory guidelines with 100% mathematical certainty against hallucination.",
        stack: ["Python / FastAPI", "Z3 SMT Solver", "Llama-3.3 Local", "Next.js", "Tailwind CSS"],
      },
      {
        title: "Edge-First Multimodal Tactile & Vision Companion",
        tagline: "Zero-cloud real-time scene parsing for accessible assistance",
        desc: "A lightweight on-device vision-language model streaming low-latency camera feeds via WebAssembly and WebGPU to narrate tactile surroundings, transcribe handwritten medication dosages, and guide visually impaired users through physical obstacles.",
        stack: ["WebGPU", "Transformers.js", "MediaPipe Vision", "Web Speech API", "React PWA"],
      },
      {
        title: "Self-Refining Multi-Agent Scientific Researcher",
        tagline: "Autonomous hypothesis generator with adversarial debate loops",
        desc: "A swarm of specialized agents (The Theorist, The Critic, The Verifier) that scrape arXiv papers, cross-validate citations against PubMed databases, simulate mathematical models, and compile structured literature syntheses.",
        stack: ["LangChain", "DuckDB", "FastAPI", "Vercel AI SDK", "Chart.js"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "State Graph & Tool Schemas",
        focus: "Lock down the agent state machine, define strict JSON output schemas, and mock external API dependencies with local fallbacks.",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "The Agentic Execution Loop",
        focus: "Wire up local or cloud inference, connect deterministic tool calling, and implement automated error recovery when execution fails.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Thought Telemetry & UX",
        focus: "Build an interactive UI that surfaces the agent's real-time step-by-step reasoning, active memory tokens, and latency telemetry.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "Stress Testing & Live Pitch Lock",
        focus: "Eliminate cold-start delays, pre-warm models, and rehearse an unscripted live demo solving a real-world task in front of judges.",
      },
    ],
    theWinningEdge: [
      "Demonstrate an unbroken feedback loop where the agent recovers gracefully from a simulated runtime error without human intervention.",
      "Prove low latency (<300ms time-to-first-token) or run on local quantized models (Ollama/vLLM) rather than relying on bloated cloud APIs.",
      "Incorporate a deterministic validation layer (JSON schema validation, AST parsing, or formal logic checks) to eliminate hallucinations.",
    ],
    pitfallsToAvoid: [
      "The 'Thin Wrapper' Trap: Submitting a basic ChatGPT prompt with a styled UI without architectural depth, tool calling, or memory.",
      "The Unverified Agent Trap: Agents that output uncontrolled hallucinated markdown without verifying if actions succeeded or failed.",
      "The Slide-Only Demo Trap: Showing mock screenshots instead of triggering a live, interactive reasoning process during judging.",
    ],
    suggestedStack: [
      "Ollama / vLLM (Local Inference)",
      "LangGraph / LangChain",
      "Vercel AI SDK 3.x",
      "LlamaIndex & Vector DBs",
      "Hugging Face Transformers.js",
      "FastAPI / Python",
      "TypeScript / Next.js",
      "Tree-sitter / Docker APIs",
    ],
    submissionTips: [
      "Demonstrate an interactive live demo rather than a pre-recorded video clip",
      "Explicitly explain your agent's evaluation framework, latency budgets, and fallback handling",
      "Highlight local inference optimizations or novel model context management techniques",
    ],
  },
  "fintech-digital-innovation": {
    seatTitle: "The Ledger's Chair · The Programmable Economy",
    seatStory:
      "Along the historic banks of the Hooghly, Kolkata flourished as an emporium of trade and merchant ledgers, where enterprise lived and died on trust, precision, and the weight of a signature. Seat 02 rewrites that foundational commerce into programmable mathematics. The legacy financial order is bogged down by predatory middlemen, multi-day clearing delays, and opaque fee extractions. In this chair, you wield zero-knowledge verification, algorithmic liquidity, and autonomous micro-treasury rails. You are building financial sovereignty: tools that allow neighborhood vendors to prove creditworthiness without revealing identity, and automated financial defenses that safeguard human labor against market friction.",
    vision:
      "Capital infrastructure is undergoing a generational reconstruction: decentralized settlement protocols, zero-knowledge solvency verification, algorithmic micro-wealth management, and AI financial sentinels. Build systems that democratize access, eliminate settlement friction, and ensure cryptographic safety.",
    whoShouldBuild:
      "Smart contract engineers, distributed systems builders, quantitative algorithm enthusiasts, and fintech designers who care about auditability, zero-knowledge privacy, and building intuitive financial products for real people.",
    starterIdeas: [
      {
        title: "ZK-Solvency Micro-Credit & Lending Protocol",
        tagline: "Verifiable undercollateralized loans with zero data leakage",
        desc: "Allows small business owners and gig workers to prove cash-flow reliability and credit history to institutional lenders using zero-knowledge zk-SNARK circuits without revealing bank balances or confidential client lists.",
        stack: ["Circom / SnarkJS", "Solidity / Foundry", "Viem", "Next.js", "PostgreSQL"],
      },
      {
        title: "Autonomous Real-Time Anti-Drain & Frontrun Shield",
        tagline: "Sub-millisecond smart contract telemetry flagging malicious exploits",
        desc: "An AI-powered RPC proxy and mempool auditor that simulates outgoing transaction states in real time, detecting reentrancy signatures, malicious approvals, and sandwich attacks before user transactions confirm.",
        stack: ["Rust", "Ethers-rs", "Go-Ethereum RPC", "WebSockets", "Tailwind CSS"],
      },
      {
        title: "Dynamic Autonomous Micro-Treasury for Creator Collectives",
        tagline: "Automated tax escrow, high-yield liquidity, and instant splits",
        desc: "Programmable financial autopilot for distributed freelancer cooperatives that splits incoming revenue, automatically sets aside algorithmic tax withholdings, and routes idle capital to risk-hedged yield pools.",
        stack: ["Solidity", "Stripe Connect API", "Prisma / Supabase", "Next.js", "Chart.js"],
      },
      {
        title: "Peer-to-Peer Offline Mesh Payment Rail",
        tagline: "Cryptographically signed voucher payments without cellular data",
        desc: "A local BLE and acoustic data transfer system allowing users in low-connectivity areas to exchange cryptographically signed balance receipts that clear automatically once connectivity is restored.",
        stack: ["Web Bluetooth API", "WebCrypto (Ed25519)", "PWA / IndexedDB", "Next.js"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "Contract Architecture & Math Primitives",
        focus: "Write and test the core smart contracts, ZK circuits, or double-entry ledgers using local test chains (Anvil/Hardhat).",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "Transaction Rails & State Simulation",
        focus: "Connect client-side signing, RPC nodes, state simulations, and real-time event listeners with seamless error handling.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Audit Dashboard & Solvency UX",
        focus: "Build clean, reassuring financial dashboards, transaction receipts, and live solvency verification proofs.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "Testnet Verification & Edge Scenarios",
        focus: "Deploy contracts to public testnets, simulate slippage and network volatility, and lock your live demonstration flow.",
      },
    ],
    theWinningEdge: [
      "Incorporate real zero-knowledge circuits (Circom/SnarkJS) or provable cryptography rather than superficial mock hashes.",
      "Design an extraordinarily clear, reassuring transaction UX that abstracts cryptographic complexity for everyday humans.",
      "Demonstrate rock-solid rollback, error handling, and slippage protection during simulated network volatility.",
    ],
    pitfallsToAvoid: [
      "The Mock Blockchain Trap: Saving transactions into a simple client-side JSON array and claiming it's a decentralized ledger.",
      "The Opaque Math Trap: Presenting complex financial calculations without clear visual representations of where money flows.",
      "The Security Blind Spot: Ignoring basic attack vectors like reentrancy, frontrunning, or unvalidated user inputs.",
    ],
    suggestedStack: [
      "Solidity / Rust (Smart Contracts)",
      "Foundry / Hardhat (Local Testnet)",
      "Ethers.js / Viem / Wagmi",
      "Stripe API / Plaid Sandbox",
      "ZK-SNARKs (Circom / SnarkJS)",
      "PostgreSQL / Prisma / Supabase",
      "Next.js / Tailwind CSS",
    ],
    submissionTips: [
      "Address edge-case failure modes, slippage, and transaction rollbacks cleanly in the UI",
      "Keep the user interface clean, reassuring, and accessible for non-technical users",
      "Include clear architectural diagrams explaining the flow of value, state, and trust",
    ],
  },
  "healthtech-wellness": {
    seatTitle: "The Caregiver's Chair · Tech Grounded in Heartbeats",
    seatStory:
      "Kolkata’s neighborhoods have always thrived on informal networks of deep human care—neighbors checking on elders across balconies, shared remedies passed over steaming tea, family doctors whose footsteps are recognized on the staircase before they knock. Seat 03 is the digital evolution of that warmth. Technology in healthcare must never feel like cold, sterile clinical machinery. Pull up this chair to build software that protects the human body and mind: sensory telemetry that detects anomalies before symptoms escalate, empathetic companions grounded in clinical behavioral science, and assistive tools that empower differently-abled citizens to navigate the physical world with autonomy and dignity.",
    vision:
      "Technology should be a gentle guardian of human vitality. From real-time sensory diagnostics and ambient preventative monitoring to privacy-sealed mental health telemetry and assistive hardware, this track is about building reliable, compassionate systems that solve real health crises without compromising dignity or privacy.",
    whoShouldBuild:
      "Biomedical innovators, IoT and wearable enthusiasts, accessible frontend designers, and full-stack developers passionate about empathetic interfaces, preventative health telemetry, and strict data privacy.",
    starterIdeas: [
      {
        title: "Ambient Optical Heart-Rate & Stress Monitor",
        tagline: "Contactless photoplethysmography via standard webcam feeds",
        desc: "Analyzes subtle sub-perceptual micro-color shifts in facial capillary blood flow through standard browser cameras to extract heart rate variability (HRV), respiratory rate, and acute stress biomarkers with zero wearable hardware required.",
        stack: ["WebRTC", "MediaPipe FaceMesh", "WebAssembly / OpenCV", "Canvas API", "Tailwind CSS"],
      },
      {
        title: "CBT-Rooted Privacy-Preserving Crisis Companion",
        tagline: "Local voice sentiment analysis and de-escalation pathways",
        desc: "A privacy-first mental wellness tool operating entirely client-side. It analyzes vocal cadence and speech sentiment to detect panic attack signatures, deploying guided acoustic somatic pacing and cognitive-behavioral grounding exercises.",
        stack: ["Web Audio API", "Transformers.js (DistilWhisper)", "IndexedDB", "Next.js", "PWA"],
      },
      {
        title: "Computer Vision Prescription & Dosage Safety Guard",
        tagline: "Real-time verification against drug contraindications and dosage slips",
        desc: "A high-contrast mobile PWA that captures handwritten physician prescriptions, cross-references active drug interactions against FDA/OpenFDA databases, and generates spoken audio reminders in local dialects for elderly patients.",
        stack: ["OpenFDA API", "Tesseract.js / Vision SLM", "Web Speech API", "React Native / Next.js"],
      },
      {
        title: "Predictive Tremor & Motor Impairment Evaluator",
        tagline: "Micro-accelerometer telemetry tracking neuromuscular changes",
        desc: "Leverages mobile device gyroscopes and touch pressure telemetry to detect early Parkinsonian micro-tremors and motor ataxia through gamified fingertip coordination exercises.",
        stack: ["DeviceOrientation API", "Chart.js", "FastAPI / PyTorch", "TypeScript"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "Sensor Calibration & Signal Pipe",
        focus: "Set up device sensor APIs (camera, audio, gyro, or Bluetooth) and verify clean mathematical signal capture.",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "Telemetry Processing & Analysis",
        focus: "Build the filtering algorithms, anomaly threshold detection, and response triggers with private local compute.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Empathetic & Accessible Interface",
        focus: "Implement large readable touch targets, screen-reader semantics, and calming, high-contrast audio/visual feedback.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "Live Physiological Demonstration",
        focus: "Test the application live on multiple team members to demonstrate observable variance during live judging.",
      },
    ],
    theWinningEdge: [
      "Strict Privacy by Design: Keep biometric signals encrypted or processed entirely client-side with zero third-party telemetry leaks.",
      "Human-Centered Empathy: Design accessible UI with high-contrast typography, keyboard navigation, and calm, panic-reducing visual hierarchy.",
      "Ground your clinical or behavioral telemetry in verified medical research papers, standard formulas, or validated datasets.",
    ],
    pitfallsToAvoid: [
      "The Unlicensed Diagnostic Trap: Making reckless clinical claims ('Our app cures depression') instead of framing as supportive telemetry.",
      "The Accessibility Blindspot: Building a healthcare tool with tiny low-contrast fonts, unlabelled icons, or flashing animations.",
      "The Data Leakage Risk: Transmitting unencrypted patient biometric data to random cloud servers.",
    ],
    suggestedStack: [
      "Web Bluetooth API",
      "TensorFlow.js / MediaPipe Vision",
      "Web Audio API & Web Speech",
      "HealthKit / Google Fit APIs",
      "WebSockets / Realtime Streams",
      "OpenFDA & PubMed APIs",
      "React Native / PWA",
      "Tailwind CSS",
    ],
    submissionTips: [
      "Treat user health data with strict privacy (zero unencrypted telemetry leakage)",
      "Ensure high contrast, accessible typography, and intuitive error states",
      "Explain the clinical basis, psychological reasoning, or user feedback loop clearly",
    ],
  },
  "cybersecurity-digital-trust": {
    seatTitle: "The Sentry's Chair · The Unbroken Perimeter",
    seatStory:
      "Behind every seamless digital transaction, medical record, and communications network sits an ongoing battle of bits. In an interconnected society, when digital infrastructure falters, real lives are upended. Seat 04 is the sentry that never sleeps. Pull up this chair if you understand that security is not a compliance checklist or a shiny badge tacked on at the end—it is an uncompromising mindset of defense-in-depth. Here, you construct zero-trust perimeters where verification is continuous, data enclaves are sealed with WebCrypto and WASM, and autonomous defense agents neutralize exploit vectors before they ever hit production. You do not build fences; you construct cryptographic certainty.",
    vision:
      "In an era of automated, AI-driven exploits, reactive security is dead on arrival. Systems must operate on zero trust, formal cryptographic verification, tamper-resistant audit trails, and self-healing dependency graphs to guarantee digital integrity and civil privacy.",
    whoShouldBuild:
      "Security researchers, cryptography enthusiasts, systems programmers (Rust/Go/C), reverse engineers, and cloud architects who think like adversaries to build impenetrable defenses.",
    starterIdeas: [
      {
        title: "Decentralized Passkey Enclave with Zero-Knowledge Proofs",
        tagline: "FIDO2 WebAuthn authentication with zero server-side biometric storage",
        desc: "A passwordless identity vault leveraging device hardware enclaves (TPM / Secure Enclave) combined with zero-knowledge membership proofs, allowing users to authenticate across untrusted platforms without revealing identity metadata.",
        stack: ["WebAuthn API", "WebCrypto", "Circom", "Rust / WASM", "Next.js"],
      },
      {
        title: "Automated Supply-Chain Vulnerability & Poisoning Sentinel",
        tagline: "Real-time AST static analysis detecting malicious npm/pip payloads",
        desc: "A lightweight CLI and CI/CD hook that inspects incoming dependency updates, analyzes obfuscated byte patterns and suspicious post-install network calls in sandboxed micro-VMs, and outputs verified remediation pull requests.",
        stack: ["Node.js / Rust", "Tree-sitter", "Docker Sandboxes", "GitHub Actions API", "Tailwind CSS"],
      },
      {
        title: "Zero-Knowledge Encrypted Collaborative Workspace",
        tagline: "End-to-end homomorphic encrypted notes and secrets management",
        desc: "A collaborative notes and secret management tool where data is encrypted on the client using AES-GCM-256 and searchable on untrusted servers using searchable symmetric encryption (SSE) without revealing plaintexts.",
        stack: ["WebCrypto API", "Libsignal Protocol", "IndexedDB", "WebSockets", "Next.js"],
      },
      {
        title: "eBPF-Powered Kernel Attack Visualizer & Active Blocker",
        tagline: "Real-time kernel syscall tracing catching privilege escalation",
        desc: "A dashboard and daemon monitoring Linux kernel execution via eBPF probes, instantly visualizing unauthorized memory probes, reverse shells, and process injection attacks with sub-millisecond automated kill signals.",
        stack: ["Go / eBPF (Cilium)", "Docker", "WebSockets", "Chart.js / D3", "Next.js"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "Threat Modeling & Cryptographic Keys",
        focus: "Define the threat model, establish cryptographic boundaries, and write unit tests for key exchange and cipher logic.",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "Enclave Defense & Verification Engine",
        focus: "Implement client-side encryption, signature verifiers, or automated inspection routines with zero plaintext leaks.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Attack Surface Telemetry UI",
        focus: "Build clear visual audit dashboards showing threat intercepts, cryptographic proof validations, and key lifecycle status.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "Adversarial Exploitation Demo",
        focus: "Run automated attack scripts against your system live to prove defense-in-depth resistance under real-world scrutiny.",
      },
    ],
    theWinningEdge: [
      "Provide a rigorous Threat Model detailing attacker capabilities, trust assumptions, and cryptographic guarantees.",
      "Execute a live exploit simulation on stage showing the attack succeeding against an unpatched system and failing against your defense.",
      "Demonstrate tamper-evident audit logging using cryptographic hash trees (Merkle Trees) or public key signatures.",
    ],
    pitfallsToAvoid: [
      "The 'Roll Your Own Crypto' Trap: Writing home-brewed XOR or broken cipher implementations instead of using audited primitives (AES-GCM, Ed25519, Libsodium).",
      "The Static Rule Trap: Hardcoding a list of three bad words and calling it an 'intrusion detection system'.",
      "The Theory-Only Pitch: Explaining cryptographic math without showing a live, running verification demo on stage.",
    ],
    suggestedStack: [
      "WebCrypto API & WebAuthn",
      "Rust / WASM / WebAssembly",
      "OpenSSL / Libsodium",
      "WireGuard / ZeroTier APIs",
      "Go / Docker / eBPF Probes",
      "Tree-sitter AST Parsing",
      "Next.js / Node.js",
    ],
    submissionTips: [
      "Present a rigorous threat model explaining attacker vectors and trust boundaries",
      "Demonstrate fail-safe defaults, audit trails, and tamper resistance",
      "Show reproducible security tests and live verification steps on stage",
    ],
  },
  "climatetech-sustainability": {
    seatTitle: "The Living World's Chair · Engineering for the Earth",
    seatStory:
      "From the delicate, biodiverse mangrove labyrinths of the Sundarbans downstream to the monsoon-soaked streets and dense urban canopies of Bengal, the living world is not a distant spreadsheet metric—it is the air we breathe and the earth that sustains us. Seat 05 brings computer science into intimate conversation with ecology. We don't need another performative greenwashing badge or speculative offset token; we need tangible software that measures real physical emissions, optimizes industrial renewable energy dispatch down to the second, tracks urban heat islands, and powers circular supply chains. Pull up this chair to build software that answers directly to the planet.",
    vision:
      "Building software for ecological accountability and planetary resilience. The climate transition requires intelligent computing: dynamic renewable grid balancing, hyper-local ecological sensor meshes, verifiable supply-chain transparency, and data legibility for environmental decision-makers.",
    whoShouldBuild:
      "Geospatial developers, IoT and hardware builders, data visualization craftspeople, and full-stack engineers driven to tackle ecological degradation, carbon transparency, and renewable energy dispatch.",
    starterIdeas: [
      {
        title: "Hyper-Local Urban Heat & Air Telemetry Mesh",
        tagline: "Low-cost distributed IoT sensors mapping street-level microclimates",
        desc: "Combines community IoT sensor streams (PM2.5, humidity, surface temperature) with satellite raster imagery from Sentinel-2 to identify urban heat islands and generate actionable tree-canopy planting recommendations.",
        stack: ["Deck.gl / Mapbox", "OpenAQ API", "Sentinel Hub", "FastAPI / GeoPandas", "Next.js"],
      },
      {
        title: "Algorithmic Renewable Battery Dispatch Simulator",
        tagline: "Real-time dispatch optimization for solar and wind fluctuations",
        desc: "An industrial grid dispatch simulator that balances variable solar and wind generation with decentralized battery storage, predicting demand spikes and cutting carbon-intensive peaker plant activations by up to 40%.",
        stack: ["Python / SciPy", "Vercel AI SDK", "Chart.js", "Tailwind CSS", "Next.js"],
      },
      {
        title: "Scope-3 Cloud Infrastructure Carbon Auditor",
        tagline: "Automated carbon intensity mapping for distributed microservices",
        desc: "A developer tool that hooks into AWS/GCP telemetry and Kubernetes pods, mapping CPU/GPU workloads to regional grid emission factors in real time and automatically re-routing batch jobs to regions powered by green energy.",
        stack: ["Kubernetes Metrics API", "Electricity Maps API", "Docker", "Node.js", "Next.js"],
      },
      {
        title: "Circular Food Waste & Surplus Logistics Rail",
        tagline: "Algorithmic routing matching restaurant surplus with shelters",
        desc: "Dynamic logistics platform connecting local food vendors, campus canteens, and distribution hubs with verified food banks, calculating perishability countdowns and optimal delivery routes before food spoils.",
        stack: ["OpenStreetMap / OSRM", "WebSockets", "Prisma / PostgreSQL", "React PWA"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "Data Grounding & Formula Validation",
        focus: "Integrate public geospatial or sensor APIs (OpenAQ/NASA) and verify the scientific emission formulas.",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "Spatial Layering & Simulation Engine",
        focus: "Render dynamic mapping layers (Deck.gl/Mapbox), wire time-series charts, and build the dispatch algorithms.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Actionable 'What-If' Scenario UI",
        focus: "Add interactive parameter sliders allowing judges to simulate policy shifts, weather spikes, or battery dispatching.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "Regional Narrative & Local Polish",
        focus: "Feed real regional coordinates into the demo to deliver an unforgettable, locally relevant environmental story.",
      },
    ],
    theWinningEdge: [
      "Ground your calculations in verifiable scientific formulas (IPCC emission factors, GHG Protocol standards, or OpenAQ datasets).",
      "Create stunning, clear geospatial and time-series data visualizations that turn intimidating environmental telemetry into intuitive stories.",
      "Emphasize low-power efficiency, offline resilience, and the economic viability of real-world deployment.",
    ],
    pitfallsToAvoid: [
      "The 'Carbon Offset Badge' Trap: A basic dashboard that multiplies page views by an arbitrary number with no scientific methodology.",
      "The Static Map Trap: Rendering a pre-baked Google Map screenshot instead of dynamic, interactive spatial telemetry.",
      "The Impractical Hardware Trap: Designing an IoT concept that costs thousands of dollars instead of accessible, deployable hardware.",
    ],
    suggestedStack: [
      "Mapbox GL / Deck.gl / Leaflet",
      "OpenAQ / NASA Earth / Sentinel APIs",
      "Electricity Maps API",
      "MQTT / InfluxDB (Time-series IoT)",
      "PostGIS / Python / GeoPandas",
      "Next.js / Chart.js",
      "Tailwind CSS",
    ],
    submissionTips: [
      "Ground metrics in verified ecological formulas or public environmental datasets",
      "Design clean data visualizations that transform raw sensor streams into clarity",
      "Highlight offline capability, low-power efficiency, and real-world deployment viability",
    ],
  },
  "open-innovation": {
    seatTitle: "The Midnight Terrace Chair · The Wildcard Frontier",
    seatStory:
      "Every legendary Kolkata idea was born after midnight on a breezy college terrace—when notebooks are filled with spontaneous architectural sketches, conventional rules are thrown out the window, and raw creative curiosity takes the wheel. Seat 06 is the Wildcard. There are no safe corporate formulas, no rigid templates, and no arbitrary boundaries here. If your project fuses WebGPU fragment shaders with physical hardware, compiles domain-specific programming languages in WebAssembly, or invents developer primitives that make other engineers gasp with awe, this chair was placed on the hill for you. Build the unclassifiable, beautiful experiment that kept you awake until 4:00 AM.",
    vision:
      "Unconstrained engineering craft and creative code. Some of the most transformative breakthroughs in computer history were unclassifiable accidents built for the sheer joy of creation. This track is for bold cross-disciplinary experiments, novel human-computer interfaces, bleeding-edge developer tooling, and uninhibited hacker ingenuity.",
    whoShouldBuild:
      "Creative coders, hardware hackers, programming language geeks, shader artists, interface obsessives, and polymaths who refuse to be boxed into standard hackathon categories.",
    starterIdeas: [
      {
        title: "Spatial Hand-Gesture Procedural CAD Modeler",
        tagline: "Turn real-time finger gestures into 3D printable meshes in-browser",
        desc: "Uses camera hand-tracking telemetry to sculpt 3D procedural geometries directly in the browser using WebGPU SDF shaders, generating exportable watertight .STL 3D printing files with zero desktop CAD software needed.",
        stack: ["Three.js / WebGPU", "MediaPipe Hands", "WASM (ManifoldCAD)", "Tailwind CSS"],
      },
      {
        title: "Serverless Local P2P Collaborative Canvas & Audio Synthesizer",
        tagline: "Zero-server real-time jam session and visual playground via WebRTC",
        desc: "A local peer-to-peer visual and auditory synthesiser where multiple laptops in the room form an ad-hoc WebRTC mesh, collaboratively editing interactive generative soundscapes and procedural visuals with zero cloud infrastructure.",
        stack: ["WebRTC / Trystero", "Web Audio API / Tone.js", "HTML5 Canvas", "Next.js"],
      },
      {
        title: "Expressive In-Browser Visual Programming Language",
        tagline: "AST visual graph compiler transforming node flows to native WASM",
        desc: "A node-based visual programming environment designed for live-coding generative animations and audio, compiling visual nodes into blazing-fast WebAssembly bytecode in under 10 milliseconds.",
        stack: ["WebAssembly (Binaryen)", "Canvas API / SVG", "TypeScript", "Tailwind CSS"],
      },
      {
        title: "Multi-Screen Ambient Display Wall via QR Pairing",
        tagline: "Turn 10 random mobile phones into a single cohesive panoramic video canvas",
        desc: "Scan a QR code on any phone in the room to instantly join a synchronized WebSockets/WebRTC multi-display matrix that calculates spatial phone alignments and renders panoramic synchronized art across all screens.",
        stack: ["WebSockets / PeerJS", "HTML5 Canvas", "DeviceOrientation API", "Next.js"],
      },
    ],
    sprintPlaybook: [
      {
        phase: "Phase 01",
        hours: "10:30 – 12:30",
        title: "The Core Technical Spike",
        focus: "Build the riskiest, most novel low-level primitive first (the shader pipeline, the compiler AST, or the P2P mesh).",
      },
      {
        phase: "Phase 02",
        hours: "12:30 – 15:00",
        title: "Tactile Input & Immediate Interactivity",
        focus: "Wire up responsive human controls (gestures, audio triggers, keyboard shortcuts) so the software feels alive to touch.",
      },
      {
        phase: "Phase 03",
        hours: "15:00 – 17:00",
        title: "Framerate Locking & Aesthetic Polish",
        focus: "Eliminate garbage collection stutters, lock 60fps rendering, and dial in the visual typography and motion craft.",
      },
      {
        phase: "Phase 04",
        hours: "17:00 – 18:30",
        title: "The Stage Spectacle Rehearsal",
        focus: "Choreograph an unforgettable 2-minute live demo that hooks the audience and judges from the very first frame.",
      },
    ],
    theWinningEdge: [
      "The Unmistakable 'Wow Factor': A demonstration so visually or functionally captivating that judges immediately pull out their phones.",
      "Technical Audacity: Solving a genuinely hard low-level problem (custom compiler, WebGPU shader, WebRTC mesh, or custom hardware hack).",
      "Flawless Stage Execution: The prototype must compile, run, and respond with silky 60fps smoothness during the live demo.",
    ],
    pitfallsToAvoid: [
      "The 'Pretty But Broken' Trap: A dazzling visual concept that crashes when touched or relies on pre-rendered video clips.",
      "The Incomprehensible Tech Trap: Building a complex esoteric tool without explaining why anyone in the room should care.",
      "The Unfocused Scope Trap: Trying to build an entire operating system in 8 hours and ending up with nothing working on stage.",
    ],
    suggestedStack: [
      "Three.js / WebGL / WebGPU",
      "WebRTC / libp2p / Trystero",
      "WebAssembly (WASM / Rust)",
      "Web Audio API / Tone.js",
      "MediaPipe Gesture / Pose",
      "Next.js / Tailwind CSS",
      "@paper-design/shaders",
    ],
    submissionTips: [
      "Prioritize sheer originality, stage presence, and live demo 'wow factor'",
      "Ensure the core prototype runs reliably and smoothly on the judges' devices",
      "Tell a compelling narrative of why this project breaks new ground",
    ],
  },
};
