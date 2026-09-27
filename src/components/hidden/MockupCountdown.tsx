"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SvgNeonDigit, { SvgNeonColon } from "./SvgNeonDigit";
import { formatTime } from "@/data/shift8";

interface MockupCountdownProps {
  remainingSeconds: number;
  isLunchTime: boolean;
  lunchRemainingSec: number;
  isRunning: boolean;
  isCodeFreeze?: boolean;
}

export default function MockupCountdown({
  remainingSeconds,
  isLunchTime,
  lunchRemainingSec,
  isRunning,
  isCodeFreeze,
}: MockupCountdownProps) {
  const [showTotalDuringLunch, setShowTotalDuringLunch] = useState(false);

  // Normal hackathon time
  const { hours, minutes, seconds } = formatTime(remainingSeconds);

  // Lunch time (formatted into hours/minutes/seconds)
  const lunchFormatted = formatTime(lunchRemainingSec);

  // Active display values
  const activeHours = isLunchTime && !showTotalDuringLunch ? "00" : hours;
  const activeMinutes = isLunchTime && !showTotalDuringLunch ? lunchFormatted.minutes : minutes;
  const activeSeconds = isLunchTime && !showTotalDuringLunch ? lunchFormatted.seconds : seconds;

  const isAmber = isLunchTime && !showTotalDuringLunch;
  const isAllZero = remainingSeconds <= 0;

  let headerText = "TIME LEFT TO HACKATHON START";
  if (isAllZero) {
    headerText = "Now is the time to pack you things!! This is the END";
  } else if (isLunchTime && !showTotalDuringLunch) {
    headerText = "LUNCH & NETWORKING TIME (01:30 – 02:15 PM)";
  } else if (isRunning || remainingSeconds < 28800) {
    headerText = "TIME LEFT TO HACKATHON FINISH";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
        textAlign: "center",
        fontFamily: "var(--font-dm-sans), sans-serif",
      }}
    >
      {/* ── Top Header Text matching mockup ── */}
      <div
        style={{
          fontSize: isAllZero ? "14px" : "14px",
          fontWeight: 700,
          letterSpacing: isAllZero ? "0.06em" : "0.145em",
          textTransform: isAllZero ? "none" : "uppercase",
          color: isAllZero ? "#000000" : isAmber ? "#30401C" : "#0A0D0A",
          minHeight: "20px",
          lineHeight: "20px",
          marginBottom: "16px",
          textShadow: isAmber
            ? "0 2px 8px rgba(0,0,0,0.6), 0 0 10px rgba(96, 130, 48, 0.35)"
            : "0 1px 2px rgba(0, 0, 0, 0.45)",
          whiteSpace: "nowrap",
          transition: "color 0.5s ease",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={headerText}
            initial={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {headerText}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Digits + Labels Row ── */}
      <div
        role="timer"
        aria-label={`${activeHours}:${activeMinutes}:${activeSeconds}`}
        data-time={`${activeHours}:${activeMinutes}:${activeSeconds}`}
        onClick={() => {
          if (isLunchTime) setShowTotalDuringLunch(!showTotalDuringLunch);
        }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          cursor: isLunchTime ? "pointer" : "default",
        }}
      >
        {/* Hours Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Pair of Digits: 52px each, 13px gap = 117px */}
          <div style={{ display: "flex", alignItems: "center", gap: "13px", width: "117px" }}>
            <SvgNeonDigit digit={activeHours[0]} isAmber={isAmber} />
            <SvgNeonDigit digit={activeHours[1]} isAmber={isAmber} />
          </div>
          {/* Label HOURS */}
          <span
            style={{
              marginTop: "16px",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isAmber ? "#30401C" : "#0A0D0A",
              height: "16px",
              lineHeight: "16px",
              textShadow: isAmber
                ? "0 1px 5px rgba(0,0,0,0.5), 0 0 10px rgba(96, 130, 48, 0.3)"
                : "0 1px 2px rgba(0, 0, 0, 0.45)",
              whiteSpace: "nowrap",
              transition: "color 0.5s ease",
            }}
          >
            HOURS
          </span>
        </div>

        {/* Colon 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "11px",
            height: "79px",
            marginLeft: "42px",
            marginRight: "42px",
          }}
        >
          <SvgNeonColon isAmber={isAmber} />
        </div>

        {/* Minutes Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Pair of Digits: 52px each, 13px gap = 117px */}
          <div style={{ display: "flex", alignItems: "center", gap: "13px", width: "117px" }}>
            <SvgNeonDigit digit={activeMinutes[0]} isAmber={isAmber} />
            <SvgNeonDigit digit={activeMinutes[1]} isAmber={isAmber} />
          </div>
          {/* Label MINUTES */}
          <span
            style={{
              marginTop: "16px",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isAmber ? "#30401C" : "#0A0D0A",
              height: "16px",
              lineHeight: "16px",
              textShadow: isAmber
                ? "0 1px 5px rgba(0,0,0,0.5), 0 0 10px rgba(96, 130, 48, 0.3)"
                : "0 1px 2px rgba(0, 0, 0, 0.45)",
              whiteSpace: "nowrap",
              transition: "color 0.5s ease",
            }}
          >
            MINUTES
          </span>
        </div>

        {/* Colon 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "11px",
            height: "79px",
            marginLeft: "42px",
            marginRight: "42px",
          }}
        >
          <SvgNeonColon isAmber={isAmber} />
        </div>

        {/* Seconds Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Pair of Digits: 52px each, 13px gap = 117px */}
          <div style={{ display: "flex", alignItems: "center", gap: "13px", width: "117px" }}>
            <SvgNeonDigit digit={activeSeconds[0]} isAmber={isAmber} />
            <SvgNeonDigit digit={activeSeconds[1]} isAmber={isAmber} />
          </div>
          {/* Label SECONDS */}
          <span
            style={{
              marginTop: "16px",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: isAmber ? "#30401C" : "#0A0D0A",
              height: "16px",
              lineHeight: "16px",
              textShadow: isAmber
                ? "0 1px 5px rgba(0,0,0,0.5), 0 0 10px rgba(96, 130, 48, 0.3)"
                : "0 1px 2px rgba(0, 0, 0, 0.45)",
              whiteSpace: "nowrap",
              transition: "color 0.5s ease",
            }}
          >
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
}
