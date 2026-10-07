/**
 * Shift-8 Live Hackathon Schedule & Milestone Data
 */

export interface Milestone {
  id: string;
  timeRange: string;
  title: string;
  /** A second line under the title on the stage's schedule card. */
  subtitle?: string;
  shortTitle: string;
  description: string;
  // Offset in seconds from the start of hacking (9:30 AM)
  startSec: number;
  endSec: number;
  isLunch?: boolean;
  /** The final submission window: the stage counts down to its deadline. */
  isSubmission?: boolean;
  isCodeFreeze?: boolean;
  badge: string;
}

/** Hacking runs from 9:30 AM to 4:30 PM: the countdown's seven hours. */
export const EVENT_START_HOUR = 9.5;
export const TOTAL_HACKATHON_SECONDS = 7 * 3600; // 25,200 seconds (7 hours)

/** Seconds after 9:30 AM for a time of day ("1:30 PM" = at(13, 30)). */
const at = (hour: number, minute = 0) => Math.round((hour + minute / 60 - EVENT_START_HOUR) * 3600);

export const HACKATHON_SCHEDULE: Milestone[] = [
  {
    id: "hacking-begins",
    timeRange: "09:30",
    title: "Hacking Begins",
    shortTitle: "Hacking Begins",
    description: "Teams officially begin developing and building their solutions.",
    startSec: at(9, 30),
    endSec: at(10),
    badge: "🚀 HACKING BEGINS",
  },
  {
    id: "sprint-1",
    timeRange: "10:00 – 11:00",
    title: "Hacking Sprint 1",
    shortTitle: "Hacking Sprint 1",
    description: "Teams continue development, implementation, and core feature building while working on their proposed solutions.",
    startSec: at(10),
    endSec: at(11),
    badge: "⚡ SPRINT 1",
  },
  {
    id: "inauguration",
    timeRange: "11:00 – 12:00",
    title: "Inauguration Ceremony",
    subtitle: "Auditorium · one member per team",
    shortTitle: "Inauguration",
    description: "The official inauguration ceremony takes place in the Auditorium. Hacking continues during the ceremony; at least one member from each team must attend.",
    startSec: at(11),
    endSec: at(12),
    badge: "🎤 INAUGURATION",
  },
  {
    id: "mentor-judge",
    timeRange: "12:00 – 01:00",
    title: "Mentor & Judge Interaction",
    shortTitle: "Mentors & Judges",
    description: "Industry mentors and judges visit teams to review their ideas, system architecture, technology choices, and initial progress, while providing technical guidance.",
    startSec: at(12),
    endSec: at(13),
    badge: "🧭 MENTOR ROUNDS",
  },
  {
    id: "lunch",
    timeRange: "01:00 – 02:00",
    title: "Lunch & Networking",
    shortTitle: "Lunch & Networking",
    description: "Participants take a break, enjoy lunch, recharge, and interact with fellow participants, mentors, and organizers.",
    startSec: at(13),
    endSec: at(14),
    isLunch: true,
    badge: "🍱 LUNCH TIME",
  },
  {
    id: "sprint-2",
    timeRange: "02:00 – 03:00",
    title: "Hacking Sprint 2",
    subtitle: "Final progress check",
    shortTitle: "Hacking Sprint 2",
    description: "Teams complete core functionality, integrate components, resolve bugs, and prepare their final prototypes. Mentors run a final progress check and help with prioritization, polishing, and presentation preparation.",
    startSec: at(14),
    endSec: at(15),
    badge: "🔥 SPRINT 2",
  },
  {
    id: "final-submission",
    timeRange: "03:00 – 03:30",
    title: "Final Submission Window",
    subtitle: "Deadline 3:30 PM",
    shortTitle: "Final Submission",
    description: "Teams finalize and submit their projects, including source code, documentation, presentation materials, and any other required deliverables. Submission deadline: 3:30 PM.",
    startSec: at(15),
    endSec: at(15, 30),
    isSubmission: true,
    badge: "📤 FINAL SUBMISSION",
  },
  {
    id: "jury",
    timeRange: "03:30 – 04:30",
    title: "Grand Jury Evaluation",
    subtitle: "Live demos & Q&A",
    shortTitle: "Jury Evaluation",
    description: "Judges evaluate the submitted projects through live demonstrations, technical presentations, and team-level Q&A sessions.",
    startSec: at(15, 30),
    endSec: at(16, 30),
    badge: "⚖️ JURY",
  },
  {
    id: "deliberation",
    timeRange: "04:30 – 04:45",
    title: "Jury Deliberation",
    subtitle: "Final arrangements",
    shortTitle: "Jury Deliberation",
    description: "The jury finalizes the results while participants prepare for the closing and awards ceremony.",
    startSec: at(16, 30),
    endSec: at(16, 45),
    badge: "🏆 DELIBERATION",
  },
];

/** The lunch slot (1:00-2:00 PM) and the final submission window (3:00-3:30 PM). */
export const LUNCH_SLOT = HACKATHON_SCHEDULE.find((m) => m.isLunch) as Milestone;
export const SUBMISSION_SLOT = HACKATHON_SCHEDULE.find((m) => m.isSubmission) as Milestone;

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
