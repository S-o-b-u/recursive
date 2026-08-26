"use client";

import { ReactNode, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Intensity = "none" | "sm" | "md" | "lg";

const BLUR: Record<Intensity, string> = {
  none: "0px",
  sm: "10px",
  md: "20px",
  lg: "34px",
};

const SHADOW: Record<Intensity, string> = {
  none: "none",
  sm: "0 6px 20px rgba(22, 45, 26, 0.12)",
  md: "0 14px 44px rgba(22, 45, 26, 0.18)",
  lg: "0 28px 70px rgba(22, 45, 26, 0.26)",
};

/* The glow is the bright 1px rim + outer bloom that reads as a glass edge. */
const GLOW: Record<Intensity, string> = {
  none: "none",
  sm: "inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(47,85,39,0.08)",
  md: "inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(47,85,39,0.1), 0 0 0 1px rgba(255,255,255,0.4)",
  lg: "inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -3px 6px rgba(47,85,39,0.12), 0 0 0 1px rgba(255,255,255,0.55), 0 0 30px rgba(143,196,90,0.25)",
};

export interface LiquidGlassCardProps {
  children?: ReactNode;
  className?: string;
  /** Bright rim + bloom on the edge. */
  glowIntensity?: Intensity;
  /** Drop shadow beneath the pane. */
  shadowIntensity?: Intensity;
  /** Backdrop blur strength. */
  blurIntensity?: Intensity;
  borderRadius?: string;
  /** Adds a subtle refraction (feDisplacementMap) over the backdrop. */
  refraction?: boolean;
  /** Pointer-draggable pane. */
  draggable?: boolean;
  /** Dark variant for deep backgrounds, clear for no fill, green for mossy/emerald liquid. */
  tone?: "light" | "dark" | "clear" | "green";
}

export function LiquidGlassCard({
  children,
  className,
  glowIntensity = "md",
  shadowIntensity = "md",
  blurIntensity = "md",
  borderRadius = "22px",
  refraction = true,
  draggable = false,
  tone = "light",
}: LiquidGlassCardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `lg-displace-${uid}`;

  const isDark = tone === "dark";
  const isClear = tone === "clear";
  const isGreen = tone === "green";

  const getBackground = () => {
    if (isClear) return "transparent";
    if (isGreen) return "linear-gradient(165deg, rgba(62, 108, 48, 0.65) 0%, rgba(28, 54, 22, 0.78) 100%)";
    if (isDark) return "rgba(16,27,18,0.42)";
    return "rgba(255,255,255,0.42)";
  };

  const getBorderTop = () => {
    if (isClear) return "1px solid rgba(255,255,255,0.2)";
    if (isGreen) return "1px solid rgba(165, 225, 105, 0.55)";
    if (isDark) return "1px solid rgba(255,255,255,0.18)";
    return "1px solid rgba(255,255,255,0.7)";
  };

  const getBorderBottom = () => {
    if (isClear) return "1px solid rgba(255,255,255,0.05)";
    if (isGreen) return "1px solid rgba(15, 32, 12, 0.5)";
    if (isDark) return "1px solid rgba(0,0,0,0.24)";
    return "1px solid rgba(47,85,39,0.06)";
  };

  const getSheenGradient = () => {
    if (isClear) return "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 34%, rgba(0,0,0,0) 100%)";
    if (isGreen) return "linear-gradient(145deg, rgba(195, 255, 140, 0.35) 0%, rgba(255,255,255,0.08) 30%, rgba(0,0,0,0) 60%, rgba(92,140,58,0.2) 100%)";
    if (isDark) return "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 34%, rgba(0,0,0,0) 62%, rgba(143,196,90,0.12) 100%)";
    return "linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.06) 32%, rgba(255,255,255,0) 60%, rgba(143,196,90,0.12) 100%)";
  };

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.12}
      className={cn("relative isolate overflow-hidden", draggable && "cursor-grab active:cursor-grabbing", className)}
      style={{
        borderRadius,
        background: getBackground(),
        backdropFilter: `blur(${BLUR[blurIntensity]}) saturate(180%)`,
        WebkitBackdropFilter: `blur(${BLUR[blurIntensity]}) saturate(180%)`,
        boxShadow: [
          SHADOW[shadowIntensity],
          GLOW[glowIntensity],
          isGreen ? "inset 0 1px 2px rgba(255,255,255,0.35), 0 4px 20px rgba(35,70,25,0.35)" : "none"
        ]
          .filter((v) => v !== "none")
          .join(", "),
        borderTop: getBorderTop(),
        borderBottom: getBorderBottom(),
        color: (isDark || isClear || isGreen) ? "#EFF3EB" : undefined,
      }}
    >
      {/* Refraction: warps whatever sits behind the pane, like thick glass. */}
      {refraction && (
        <>
          <svg aria-hidden className="absolute h-0 w-0">
            <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.012"
                numOctaves={2}
                seed={11}
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="6" result="soft" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            style={{
              borderRadius: "inherit",
              backdropFilter: `url(#${filterId})`,
              WebkitBackdropFilter: `url(#${filterId})`,
            }}
          />
        </>
      )}

      {/* Specular sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: "inherit",
          background: getSheenGradient(),
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}

export default LiquidGlassCard;
