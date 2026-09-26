/**
 * Shift-8 Live Hackathon Schedule & Milestone Data
 */

export interface Milestone {
  id: string;
  timeRange: string;
  title: string;
  shortTitle: string;
  description: string;
  // Offset in seconds from hackathon start (0 to 28800 = 8 hours)
  startSec: number;
  endSec: number;
  isLunch?: boolean;
  isCodeFreeze?: boolean;
  badge: string;
}

export const TOTAL_HACKATHON_SECONDS = 8 * 3600; // 28,800 seconds (8 hours)

export const HACKATHON_SCHEDULE: Milestone[] = [
  {
    id: "start",
    timeRange: "10:00",
    title: "Shift-8 Starts",
    shortTitle: "Shift-8 Start",
    description: "Opening ceremony concludes. 8-hour hacking sprint officially begins!",
    startSec: 0,
    endSec: 3600, // until 11:00
    badge: "🚀 KICKOFF",
  },
  {
    id: "checkpoint-1",
    timeRange: "11:00 – 01:00",
    title: "Sprint Checkpoint 1",
    shortTitle: "Checkpoint 1",
    description: "Mentors review repo setup, architecture diagram, and core API prototypes.",
    startSec: 3600, // 1 hour elapsed
    endSec: 10800, // 3 hours elapsed (01:00 PM)
    badge: "⚡ SPRINT CHECK 1",
  },
  {
    id: "lunch",
    timeRange: "01:30 – 02:15",
    title: "Lunch & Networking",
    shortTitle: "Lunch & Networking",
    description: "Refuel, relax, enjoy your meal, and network with sponsors and fellow hackers.",
    startSec: 12600, // 3h 30m elapsed (01:30 PM)
    endSec: 15300, // 4h 15m elapsed (02:15 PM) -> 45 min duration
    isLunch: true,
    badge: "🍱 LUNCH TIME",
  },
  {
    id: "checkpoint-2",
    timeRange: "02:15 – 04:30",
    title: "Sprint Checkpoint 2 & Devfolio Submission Deadline",
    shortTitle: "Checkpoint 2 & Devfolio",
    description: "Final mentor checkpoints. All project repos & Devfolio submissions must be locked in by 04:30 PM!",
    startSec: 15300, // 4h 15m elapsed (02:15 PM)
    endSec: 23400, // 6h 30m elapsed (04:30 PM)
    badge: "🔥 FINAL SUBMISSION",
  },
  {
    id: "code-freeze",
    timeRange: "05:00",
    title: "Code Freeze",
    shortTitle: "Code Freeze",
    description: "All GitHub commits frozen. Hard deadline for all tracks. Jury evaluations commence.",
    startSec: 25200, // 7h elapsed (05:00 PM)
    endSec: 28800, // 8h elapsed (06:00 PM)
    isCodeFreeze: true,
    badge: "🚨 CODE FREEZE",
  },
];

/**
 * Format total remaining seconds into { hours, minutes, seconds }
 */
export function formatTime(seconds: number) {
  const clamped = Math.max(0, Math.floor(seconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
}

/**
 * Determine the active milestone given elapsed seconds
 */
export function getActiveMilestone(elapsedSec: number): Milestone | undefined {
  return HACKATHON_SCHEDULE.find(
    (m) => elapsedSec >= m.startSec && elapsedSec < m.endSec
  );
}
