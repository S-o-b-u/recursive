"use client";

import type React from "react";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { MapPin, Navigation, ExternalLink, Compass } from "lucide-react";

interface LocationMapProps {
  location?: string;
  coordinates?: string;
  className?: string;
  defaultExpanded?: boolean;
  address?: string;
  mapsUrl?: string;
}

export function LocationMap({
  location = "Guru Nanak Institute of Technology",
  coordinates = "22.6997° N, 88.3792° E",
  className = "",
  defaultExpanded = true,
  address = "157/F, Nilgunj Rd, Panihati, Sodepur, Kolkata 700114",
  mapsUrl = "https://maps.google.com/?q=Guru+Nanak+Institute+of+Technology+Panihati+Sodepur+Kolkata",
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [6, -6]);
  const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);

  const springRotateX = useSpring(rotateX, { stiffness: 260, damping: 26 });
  const springRotateY = useSpring(rotateY, { stiffness: 260, damping: 26 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <motion.div
        ref={containerRef}
        className="relative w-full cursor-pointer select-none"
        style={{
          perspective: 1200,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={toggleExpanded}
      >
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/20 dark:border-emerald-500/20 bg-emerald-950/90 text-emerald-50 shadow-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            height: isExpanded ? 340 : 160,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          {/* Subtle gradient & grid overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-black/60 pointer-events-none" />

          {/* Map canvas / schematic streets */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Background grid */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
              <defs>
                <pattern id="gnit-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(143,196,90,0.4)" strokeWidth="0.75" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gnit-grid)" />
            </svg>

            {/* Schematic Road Network */}
            <svg className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none">
              {/* Nilgunj Road (Main artery) */}
              <motion.line
                x1="0%"
                y1="40%"
                x2="100%"
                y2="40%"
                stroke="rgba(143, 219, 130, 0.7)"
                strokeWidth="6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              {/* Sodepur Station Road */}
              <motion.line
                x1="45%"
                y1="0%"
                x2="45%"
                y2="100%"
                stroke="rgba(143, 219, 130, 0.6)"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              {/* BT Road Connector */}
              <motion.line
                x1="0%"
                y1="75%"
                x2="100%"
                y2="75%"
                stroke="rgba(100, 180, 110, 0.45)"
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              {/* Cross streets */}
              {[20, 80].map((x, i) => (
                <line
                  key={`v-${i}`}
                  x1={`${x}%`}
                  y1="0%"
                  x2={`${x}%`}
                  y2="100%"
                  stroke="rgba(143, 219, 130, 0.25)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              ))}
              {[15, 60].map((y, i) => (
                <line
                  key={`h-${i}`}
                  x1="0%"
                  y1={`${y}%`}
                  x2="100%"
                  y2={`${y}%`}
                  stroke="rgba(143, 219, 130, 0.2)"
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            {/* Campus Footprint Blocks */}
            <div className="absolute top-[28%] left-[40%] w-[26%] h-[28%] rounded-lg border border-emerald-400/40 bg-emerald-500/15 backdrop-blur-xs flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-200 uppercase text-center px-1">
                GNIT Campus
              </span>
            </div>

            {/* Surrounding Landmark Blocks */}
            <div className="absolute top-[12%] left-[10%] w-[18%] h-[18%] rounded border border-emerald-500/20 bg-emerald-800/20 flex items-center justify-center">
              <span className="text-[8px] sm:text-[9px] text-emerald-300/80 font-mono">Sodepur Stn</span>
            </div>
            <div className="absolute bottom-[12%] right-[12%] w-[20%] h-[16%] rounded border border-emerald-500/20 bg-emerald-800/20 flex items-center justify-center">
              <span className="text-[8px] sm:text-[9px] text-emerald-300/80 font-mono">BT Rd Jn</span>
            </div>

            {/* Animated Pin Location */}
            <motion.div
              className="absolute top-[40%] left-[53%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.2,
              }}
            >
              {/* Radar pulse */}
              <span className="absolute -top-1 w-10 h-10 rounded-full bg-emerald-400/30 animate-ping" />
              <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/50">
                <MapPin className="w-5 h-5 fill-black stroke-black" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-black/80 border border-emerald-400/40 text-[10px] font-bold text-emerald-300 tracking-wide whitespace-nowrap shadow-md">
                GNIT Main Gate
              </span>
            </motion.div>
          </div>

          {/* Foreground Info Overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6 bg-gradient-to-t from-black/80 via-transparent to-black/40">
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                <span className="text-xs font-semibold text-emerald-200 tracking-wide">
                  Live Venue Map
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                  Open
                </span>
              </div>
            </div>

            {/* Bottom Content Bar */}
            <div className="space-y-2 bg-black/60 sm:bg-black/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                    {location}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                    {address}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors shadow-md"
                  >
                    <span>Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-emerald-300/80 font-mono"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>GPS: {coordinates}</span>
                    <span className="text-emerald-400 font-sans font-medium">Click map to toggle view size</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
