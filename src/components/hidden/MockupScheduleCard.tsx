"use client";

import React from "react";

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  secondsOffset: number;
  isLunch?: boolean;
}

export const MOCKUP_SCHEDULE: ScheduleItem[] = [
  {
    id: "shift-8-start",
    time: "10:00",
    title: "Shift-8 Starts",
    secondsOffset: 0,
  },
  {
    id: "checkpoint-1",
    time: "11:00 – 01:00",
    title: "Sprint Checkpoint 1",
    secondsOffset: 3600,
  },
  {
    id: "lunch-networking",
    time: "01:30 – 02:15",
    title: "Lunch & Networking",
    secondsOffset: 12600,
    isLunch: true,
  },
  {
    id: "checkpoint-2",
    time: "02:15 – 04:30",
    title: "Sprint Checkpoint 2 & Devfolio",
    subtitle: "Submission Deadline",
    secondsOffset: 15300,
  },
  {
    id: "code-freeze",
    time: "05:00",
    title: "Code Freeze",
    secondsOffset: 25200,
  },
];

export function getActiveMockupMilestone(
  elapsedSeconds: number,
  forcedLunch?: boolean
): ScheduleItem {
  if (forcedLunch) {
    const lunchItem = MOCKUP_SCHEDULE.find((m) => m.isLunch);
    if (lunchItem) return lunchItem;
  }
  let active = MOCKUP_SCHEDULE[0];
  for (let i = 0; i < MOCKUP_SCHEDULE.length; i++) {
    if (elapsedSeconds >= MOCKUP_SCHEDULE[i].secondsOffset) {
      active = MOCKUP_SCHEDULE[i];
    } else {
      break;
    }
  }
  return active;
}

interface MockupScheduleCardProps {
  elapsedSeconds: number;
  isLunchActive: boolean;
  onSelectMilestone?: (seconds: number, isLunch?: boolean) => void;
}

export default function MockupScheduleCard({
  elapsedSeconds,
  isLunchActive,
  onSelectMilestone,
}: MockupScheduleCardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "324px",
        background: "rgba(4, 10, 4, 0.18)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "16px",
        color: "#fff",
        userSelect: "none",
        fontFamily: "var(--font-dm-sans), sans-serif",
        overflow: "hidden",
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {MOCKUP_SCHEDULE.map((item) => {
        const isLunchItem = Boolean(item.isLunch);

        // Lunch & Networking: white until lunch time is active, then #30401C (Ceylanite)
        // All other items: always white
        const textColor =
          isLunchItem && isLunchActive
            ? "#30401C"
            : "rgba(255, 255, 255, 0.90)";

        return (
          <div
            key={item.id}
            data-milestone-id={item.id}
            onClick={() => onSelectMilestone?.(item.secondsOffset, item.isLunch)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: "11.5px",
              lineHeight: 1.35,
              letterSpacing: "0.01em",
              cursor: "pointer",
            }}
          >
            {/* Time column */}
            <div
              style={{
                width: "98px",
                flexShrink: 0,
                color: textColor,
                fontWeight: isLunchItem ? 600 : 400,
                whiteSpace: "nowrap",
                transition: "color 0.3s ease",
              }}
            >
              {item.time}
            </div>

            {/* Title + subtitle column */}
            <div
              style={{
                flex: 1,
                color: textColor,
                fontWeight: isLunchItem ? 600 : 400,
                transition: "color 0.3s ease",
              }}
            >
              <div style={{ whiteSpace: "nowrap" }}>{item.title}</div>
              {item.subtitle && (
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "rgba(255, 255, 255, 0.60)",
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                    marginTop: "2px",
                  }}
                >
                  {item.subtitle}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
