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
        background: "rgba(18, 28, 14, 0.16)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "18px",
        boxShadow: "0 10px 28px -4px rgba(0, 0, 0, 0.25)",
        color: "#fff",
        userSelect: "none",
        fontFamily: "var(--font-dm-sans), sans-serif",
        overflow: "hidden",
        padding: "18px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {MOCKUP_SCHEDULE.map((item) => {
        const isItemLunchActive = item.isLunch && isLunchActive;
        const isLunchItem = Boolean(item.isLunch);

        const timeColor = isLunchItem
          ? isItemLunchActive
            ? "#22c55e"
            : "#16a34a"
          : isItemLunchActive
          ? "#FDE68A"
          : "rgba(255, 255, 255, 0.88)";

        const titleColor = isLunchItem
          ? isItemLunchActive
            ? "#22c55e"
            : "#16a34a"
          : isItemLunchActive
          ? "#FDE68A"
          : "rgba(255, 255, 255, 0.95)";

        return (
          <div
            key={item.id}
            data-milestone-id={item.id}
            onClick={() => onSelectMilestone?.(item.secondsOffset, item.isLunch)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              fontSize: "11.5px",
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              cursor: "pointer",
            }}
          >
            {/* Left Column: Time */}
            <div
              style={{
                width: "98px",
                flexShrink: 0,
                color: timeColor,
                fontWeight: isLunchItem ? 600 : 400,
                whiteSpace: "nowrap",
                textShadow: isLunchItem ? "0 1px 3px rgba(0, 0, 0, 0.7)" : undefined,
                transition: "color 0.3s ease",
              }}
            >
              {item.time}
            </div>

            {/* Right Column: Title + Subtitle */}
            <div
              style={{
                flex: 1,
                color: titleColor,
                fontWeight: isLunchItem ? 600 : 400,
                textShadow: isLunchItem ? "0 1px 3px rgba(0, 0, 0, 0.7)" : undefined,
                transition: "color 0.3s ease",
              }}
            >
              <div style={{ whiteSpace: "nowrap" }}>{item.title}</div>
              {item.subtitle && (
                <div
                  style={{
                    fontSize: "10.5px",
                    color: isItemLunchActive ? "rgba(253, 230, 138, 0.8)" : "rgba(255, 255, 255, 0.80)",
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
