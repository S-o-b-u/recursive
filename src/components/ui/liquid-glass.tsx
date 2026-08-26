"use client";

import { ReactNode, useId, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
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
  sm: "0 6px 20px rgba(16, 32, 18, 0.16)",
  md: "0 14px 44px rgba(14, 30, 16, 0.24)",
  lg: "0 28px 70px rgba(12, 28, 14, 0.32)",
};

const GLOW: Record<Intensity, string> = {
  none: "none",
  sm: "inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(47,85,39,0.08)",
  md: "inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(47,85,39,0.1), 0 0 0 1px rgba(255,255,255,0.4)",
  lg: "inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -3px 6px rgba(47,85,39,0.12), 0 0 0 1px rgba(255,255,255,0.55), 0 0 30px rgba(143,196,90,0.25)",
};

export interface LiquidGlassCardProps {
  children?: ReactNode;
  className?: string;
  glowIntensity?: Intensity;
  shadowIntensity?: Intensity;
  blurIntensity?: Intensity;
  borderRadius?: string;
  refraction?: boolean;
  draggable?: boolean;
  tone?: "light" | "dark" | "clear" | "green";
  fluidAnimation?: boolean;
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
  fluidAnimation = true,
}: LiquidGlassCardProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `lg-displace-${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  // Fluid spring mouse physics (viscous elastic liquid lag)
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.5 });

  const fluidSpotlightBg = useTransform(
    [springX, springY],
    ([x, y]) => {
      if (tone === "green") {
        return `radial-gradient(circle 80px at ${x}% ${y}%, rgba(210, 255, 155, 0.45) 0%, rgba(135, 230, 95, 0.22) 40%, transparent 75%)`;
      }
      if (tone === "dark") {
        return `radial-gradient(circle 85px at ${x}% ${y}%, rgba(185, 240, 150, 0.25) 0%, rgba(95, 175, 80, 0.12) 45%, transparent 75%)`;
      }
      return `radial-gradient(circle 80px at ${x}% ${y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 75%)`;
    }
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(Math.max(0, Math.min(100, xPercent)));
      mouseY.set(Math.max(0, Math.min(100, yPercent)));
    },
    [mouseX, mouseY]
  );

  const isDark = tone === "dark";
  const isClear = tone === "clear";
  const isGreen = tone === "green";

  const getBackground = () => {
    if (isClear) return "transparent";
    // Natural lush alpine moss glass
    if (isGreen) return "linear-gradient(150deg, rgba(36, 68, 30, 0.82) 0%, rgba(18, 38, 16, 0.94) 100%)";
    // Natural smoked obsidian/botanical deep glass
    if (isDark) return "linear-gradient(150deg, rgba(16, 26, 18, 0.82) 0%, rgba(8, 15, 9, 0.94) 100%)";
    return "rgba(255,255,255,0.42)";
  };

  const getBorderTop = () => {
    if (isClear) return "1px solid rgba(255,255,255,0.2)";
    if (isGreen) return "1px solid rgba(200, 250, 160, 0.55)";
    if (isDark) return "1px solid rgba(255,255,255,0.24)";
    return "1px solid rgba(255,255,255,0.7)";
  };

  const getBorderBottom = () => {
    if (isClear) return "1px solid rgba(255,255,255,0.05)";
    if (isGreen) return "1px solid rgba(12, 28, 10, 0.65)";
    if (isDark) return "1px solid rgba(0,0,0,0.38)";
    return "1px solid rgba(47,85,39,0.06)";
  };

  const getSheenGradient = () => {
    if (isClear) return "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 34%, rgba(0,0,0,0) 100%)";
    if (isGreen) return "linear-gradient(145deg, rgba(215, 255, 170, 0.32) 0%, rgba(255,255,255,0.08) 28%, rgba(0,0,0,0) 58%, rgba(110,180,75,0.22) 100%)";
    if (isDark) return "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 34%, rgba(0,0,0,0) 62%, rgba(135,190,95,0.12) 100%)";
    return "linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.06) 32%, rgba(255,255,255,0) 60%, rgba(143,196,90,0.12) 100%)";
  };

  return (
    <motion.div
      ref={containerRef}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.12}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        mouseX.set(50);
        mouseY.set(50);
      }}
      onPointerMove={handlePointerMove}
      className={cn("relative isolate overflow-hidden group select-none", draggable && "cursor-grab active:cursor-grabbing", className)}
      style={{
        borderRadius,
        background: getBackground(),
        backdropFilter: `blur(${BLUR[blurIntensity]}) saturate(190%)`,
        WebkitBackdropFilter: `blur(${BLUR[blurIntensity]}) saturate(190%)`,
        boxShadow: [
          SHADOW[shadowIntensity],
          GLOW[glowIntensity],
          glowIntensity !== "none" && isGreen ? "inset 0 1px 2px rgba(255,255,255,0.45)" : "none",
          glowIntensity !== "none" && isDark ? "inset 0 1px 1px rgba(255,255,255,0.25)" : "none",
        ]
          .filter((v) => v !== "none" && Boolean(v))
          .join(", ") || "none",
        borderTop: getBorderTop(),
        borderBottom: getBorderBottom(),
        color: (isDark || isClear || isGreen) ? "#EFF3EB" : undefined,
      }}
    >
      {/* ── 1. Refraction: warps whatever sits behind the pane ── */}
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

      {/* ── 2. Pure Living Liquid Currents (Continuous Organic Morphing & Drifting) ── */}
      {fluidAnimation && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" style={{ borderRadius: "inherit" }}>
          {/* Ambient Liquid Current Blob 1 */}
          <div
            className={cn(
              "absolute -inset-[30%] opacity-40 mix-blend-screen transition-opacity duration-700",
              isGreen ? "bg-[radial-gradient(ellipse_60%_50%_at_30%_35%,rgba(165,245,115,0.45),transparent_70%)]" : "bg-[radial-gradient(ellipse_60%_50%_at_30%_35%,rgba(140,195,115,0.28),transparent_70%)]"
            )}
            style={{
              animation: "liquidBlobMorph1 9s ease-in-out infinite alternate",
            }}
          />

          {/* Ambient Liquid Current Blob 2 */}
          <div
            className={cn(
              "absolute -inset-[30%] opacity-35 mix-blend-screen transition-opacity duration-700",
              isGreen ? "bg-[radial-gradient(ellipse_55%_60%_at_75%_65%,rgba(95,190,80,0.5),transparent_70%)]" : "bg-[radial-gradient(ellipse_55%_60%_at_75%_65%,rgba(65,125,75,0.32),transparent_70%)]"
            )}
            style={{
              animation: "liquidBlobMorph2 11s ease-in-out infinite alternate-reverse",
            }}
          />

          {/* Continuous Elastic Liquid Wave Shimmer */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "liquidWaveFlow 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            }}
          />

          {/* ── 3. Interactive Elastic Liquid Spotlight (Follows cursor with viscous spring lag) ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: fluidSpotlightBg,
              opacity: isHovered ? 1 : 0.25,
            }}
          />
        </div>
      )}

      {/* ── 4. Specular Glass Sheen ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          borderRadius: "inherit",
          background: getSheenGradient(),
          mixBlendMode: "screen",
        }}
      />

      {/* ── 5. Button Content ── */}
      <div className="relative z-20">{children}</div>

      <style jsx>{`
        @keyframes liquidBlobMorph1 {
          0% {
            transform: translate3d(-8%, -6%, 0) rotate(0deg) scale(1);
            border-radius: 40% 60% 70% 30% / 40% 40% 60% 60%;
          }
          50% {
            transform: translate3d(6%, 8%, 0) rotate(180deg) scale(1.18);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          100% {
            transform: translate3d(-4%, 5%, 0) rotate(360deg) scale(0.95);
            border-radius: 40% 60% 70% 30% / 40% 40% 60% 60%;
          }
        }

        @keyframes liquidBlobMorph2 {
          0% {
            transform: translate3d(8%, 6%, 0) rotate(360deg) scale(1.1);
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
          }
          50% {
            transform: translate3d(-6%, -8%, 0) rotate(180deg) scale(0.9);
            border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
          }
          100% {
            transform: translate3d(5%, -4%, 0) rotate(0deg) scale(1.05);
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
          }
        }

        @keyframes liquidWaveFlow {
          0% {
            background-position: -200% 0;
          }
          50% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default LiquidGlassCard;
