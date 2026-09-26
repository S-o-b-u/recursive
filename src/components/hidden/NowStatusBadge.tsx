"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScheduleItem } from "./MockupScheduleCard";

interface NowStatusBadgeProps {
  item: ScheduleItem;
  isLunchActive: boolean;
}

export default function NowStatusBadge({
  item,
  isLunchActive,
}: NowStatusBadgeProps) {
  const isLunch = Boolean(item.isLunch || isLunchActive);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        padding: "2px 0",
        background: "transparent",
        userSelect: "none",
        fontFamily: "var(--font-dm-sans), sans-serif",
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
        textShadow: isLunch
          ? "0 1px 3px rgba(0, 0, 0, 0.95), 0 2px 10px rgba(0, 0, 0, 0.75)"
          : "0 1px 2px rgba(0, 0, 0, 0.35)",
      }}
    >
      <motion.span
        key={item.id + "-pipe"}
        initial={{ scaleY: 0.6, opacity: 0.6 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "inline-block",
          color: isLunch ? "#FDE68A" : "#000000",
          fontWeight: 900,
          fontSize: "19px",
          lineHeight: 1,
        }}
      >
        |
      </motion.span>
      <span
        style={{
          color: isLunch ? "#FDE68A" : "#000000",
          fontWeight: 800,
          fontSize: "14px",
          letterSpacing: "0.12em",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        NOW:
      </span>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "middle",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={item.id}
            initial={{ opacity: 0, y: 14, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(3px)" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "inline-block",
              color: isLunch ? "#FEF08A" : "#000000",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.02em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
