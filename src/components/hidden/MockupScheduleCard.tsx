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
        background: "linear-gradient(160deg, rgba(10, 18, 10, 0.72) 0%, rgba(16, 26, 14, 0.68) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: isLunchActive
          ? "1px solid rgba(74, 222, 128, 0.18)"
          : "1px solid rgba(255, 255, 255, 0.09)",
        borderRadius: "20px",
        boxShadow: isLunchActive
          ? "0 12px 32px -4px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(74, 222, 128, 0.08)"
          : "0 12px 32px -4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        color: "#fff",
        userSelect: "none",
        fontFamily: "var(--font-dm-sans), sans-serif",
        overflow: "hidden",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        transition: "border-color 0.5s ease, box-shadow 0.5s ease",
      }}
    >
      {MOCKUP_SCHEDULE.map((item, index) => {
        const isItemLunchActive = item.isLunch && isLunchActive;
        const isLunchItem = Boolean(item.isLunch);

        const timeColor = isLunchItem
          ? isItemLunchActive
            ? "#4ade80"
            : "#16a34a"
          : "rgba(255, 255, 255, 0.75)";

        const titleColor = isLunchItem
          ? isItemLunchActive
            ? "#4ade80"
            : "#16a34a"
          : "rgba(255, 255, 255, 0.92)";

        return (
          <div key={item.id}>
            {/* Divider between rows */}
            {index > 0 && (
              <div
                style={{
                  height: "1px",
                  background: isItemLunchActive
                    ? "linear-gradient(90deg, rgba(74, 222, 128, 0.25), rgba(74, 222, 128, 0.05))"
                    : "rgba(255, 255, 255, 0.06)",
                  margin: "0 0",
                  transition: "background 0.4s ease",
                }}
              />
            )}
            <div
              data-milestone-id={item.id}
              onClick={() => onSelectMilestone?.(item.secondsOffset, item.isLunch)}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "11.5px",
                lineHeight: 1.35,
                letterSpacing: "0.01em",
                cursor: "pointer",
                padding: "9px 8px 9px 8px",
                borderRadius: "8px",
                marginLeft: "-4px",
                marginRight: "-4px",
                background: isItemLunchActive
                  ? "rgba(74, 222, 128, 0.07)"
                  : "transparent",
                borderLeft: isItemLunchActive
                  ? "2px solid #4ade80"
                  : "2px solid transparent",
                transition: "background 0.4s ease, border-color 0.4s ease",
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
                  textShadow: isItemLunchActive
                    ? "0 0 8px rgba(74, 222, 128, 0.4)"
                    : undefined,
                  transition: "color 0.4s ease, text-shadow 0.4s ease",
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
                  textShadow: isItemLunchActive
                    ? "0 0 8px rgba(74, 222, 128, 0.4)"
                    : undefined,
                  transition: "color 0.4s ease, text-shadow 0.4s ease",
                }}
              >
                <div style={{ whiteSpace: "nowrap" }}>{item.title}</div>
                {item.subtitle && (
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "rgba(255, 255, 255, 0.65)",
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
          </div>
        );
      })}
    </div>
  );
}
