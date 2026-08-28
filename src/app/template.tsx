"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // For the home page, skip the wrapper so IntroSequence and Hero
  // render directly in the root stacking context with zero interference.
  if (reduced || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      }}
      style={{ width: "100%", position: "relative" }}
    >
      {children}
    </motion.div>
  );
}
