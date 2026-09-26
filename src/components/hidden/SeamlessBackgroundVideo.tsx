"use client";

import React, { useRef, useEffect, useState } from "react";

interface SeamlessBackgroundVideoProps {
  src?: string;
  poster?: string;
}

/** How early (in seconds) before the video ends to begin the crossfade. */
const CROSSFADE_LEAD_S = 1.8;

/** CSS transition duration (ms) for the opacity crossfade. */
const CROSSFADE_CSS_MS = 700;

/**
 * True zero-blink dual-buffer seamless looping video player.
 *
 * Key design decisions for maximum seamlessness:
 * 1. Crossfade starts CROSSFADE_LEAD_S seconds before the active video ends,
 *    giving 1.1 s of overlap after the CSS transition completes.
 * 2. The opacity transition begins IMMEDIATELY — we do NOT await the play()
 *    promise, which can take 50-200 ms and cut into the lead window.
 * 3. At the halfway point of the active video we seek the standby video to t=0
 *    so it is fully pre-buffered by the time the crossfade fires.
 * 4. The outgoing video is not paused/reset until CROSSFADE_CSS_MS + 200 ms
 *    after the crossfade begins, ensuring it stays solid underneath even if
 *    the network is slow.
 */
export default function SeamlessBackgroundVideo({
  src = "/videos/hackathon-chair-seamless.mp4",
  poster = "/videos/chair-poster.jpg",
}: SeamlessBackgroundVideoProps) {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);

  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);
  const [zIndexA, setZIndexA] = useState(1);
  const [zIndexB, setZIndexB] = useState(0);
  const [posterVisible, setPosterVisible] = useState(true);

  const activeRef = useRef<"A" | "B">("A");
  const transitioningRef = useRef(false);

  // ── Initial playback ─────────────────────────────────────────────────────
  useEffect(() => {
    const vA = videoA.current;
    const vB = videoB.current;
    if (!vA) return;

    const onPlaying = () => setPosterVisible(false);
    vA.addEventListener("playing", onPlaying, { once: true });
    vA.play().catch(() => {});

    // Aggressively pre-buffer video B from the start
    if (vB) {
      vB.load();
      vB.currentTime = 0;
    }
  }, []);

  // ── Frame-accurate crossfade loop ─────────────────────────────────────────
  useEffect(() => {
    let animFrame: number;
    let midpointReached = false; // whether we've pre-seeked standby this cycle

    const tick = () => {
      const active = activeRef.current;
      const current = active === "A" ? videoA.current : videoB.current;
      const next    = active === "A" ? videoB.current : videoA.current;

      if (current && next && current.duration > 0 && !transitioningRef.current) {
        const elapsed   = current.currentTime;
        const duration  = current.duration;
        const remaining = duration - elapsed;

        // At 50% through the active clip, ensure the standby is seeked to 0
        // and has entered at least the HAVE_FUTURE_DATA readyState (≥3).
        if (!midpointReached && elapsed >= duration * 0.5) {
          midpointReached = true;
          if (next.readyState < 3) {
            next.currentTime = 0;
          }
        }

        // ── Begin crossfade ──────────────────────────────────────────────
        if (remaining <= CROSSFADE_LEAD_S) {
          transitioningRef.current = true;
          midpointReached = false; // reset for next cycle

          // Seek standby to 0 and fire play() — fire-and-forget intentionally;
          // we must NOT await it before touching opacity or we burn the lead window.
          next.currentTime = 0;
          next.play().catch(() => {});

          // Immediately kick off the CSS opacity transition
          if (active === "A") {
            setZIndexB(2);
            setZIndexA(1);
            setOpacityB(1);
          } else {
            setZIndexA(2);
            setZIndexB(1);
            setOpacityA(1);
          }

          // After the CSS fade finishes (+200 ms buffer), retire the outgoing video.
          // By this point it has been invisible for ≥200 ms so resetting it is safe.
          setTimeout(() => {
            if (active === "A") {
              setOpacityA(0);
              activeRef.current = "B";
              current.pause();
              current.currentTime = 0;
            } else {
              setOpacityB(0);
              activeRef.current = "A";
              current.pause();
              current.currentTime = 0;
            }
            transitioningRef.current = false;
          }, CROSSFADE_CSS_MS + 200);
        }
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-black">
      {/* Poster layer — dissolves once video begins playing */}
      {poster && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${poster})`,
            opacity: posterVisible ? 1 : 0,
            transition: "opacity 0.9s ease-in-out",
            zIndex: 0,
          }}
        />
      )}

      {/* Video A */}
      <video
        ref={videoA}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity]"
        style={{
          opacity: opacityA,
          zIndex: zIndexA,
          transition: `opacity ${CROSSFADE_CSS_MS}ms ease-in-out`,
        }}
      />

      {/* Video B */}
      <video
        ref={videoB}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity]"
        style={{
          opacity: opacityB,
          zIndex: zIndexB,
          transition: `opacity ${CROSSFADE_CSS_MS}ms ease-in-out`,
        }}
      />
    </div>
  );
}
