"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/**
 * Scroll-in reveal. Motion handles the in-view entrance for content; GSAP is
 * reserved for scrubbed, scroll-linked choreography (the hero).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT, delay: reduced ? 0 : delay }}
    >
      {children}
    </Tag>
  );
}
