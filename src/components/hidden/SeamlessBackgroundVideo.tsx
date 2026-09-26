"use client";

import React, { useRef, useEffect, useState } from "react";

interface SeamlessBackgroundVideoProps {
  src?: string;
  poster?: string;
}

/**
 * True zero-blink dual-buffer seamless looping video player.
 * The outgoing video stays 100% opaque underneath while the incoming
 * video fades in on top, guaranteeing 0% black background bleed-through
 * and complete continuity without any visual hitch or blink.
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

  // Initial playback on mount
  useEffect(() => {
    const vA = videoA.current;
    if (!vA) return;

    const onInitialPlay = () => {
      setPosterVisible(false);
    };

    vA.addEventListener("playing", onInitialPlay, { once: true });
    vA.play().catch(() => {});

    if (videoB.current) {
      videoB.current.load();
    }
  }, []);

  // Frame monitor for zero-dip seamless crossfade
  useEffect(() => {
    let animFrame: number;

    const checkTime = () => {
      const active = activeRef.current;
      const current = active === "A" ? videoA.current : videoB.current;
      const next = active === "A" ? videoB.current : videoA.current;

      if (current && next && current.duration > 0 && !transitioningRef.current) {
        const remaining = current.duration - current.currentTime;

        // Trigger transition 1.0s before current video ends
        if (remaining <= 1.0) {
          transitioningRef.current = true;

          next.currentTime = 0;
          next.play().then(() => {
            if (active === "A") {
              // B fades in on top of A; A remains solid 100% opacity underneath
              setZIndexB(2);
              setZIndexA(1);
              setOpacityB(1);
            } else {
              // A fades in on top of B; B remains solid 100% opacity underneath
              setZIndexA(2);
              setZIndexB(1);
              setOpacityA(1);
            }

            // Once crossfade finishes, incoming video is 100% solid. Safe to reset outgoing video.
            setTimeout(() => {
              if (active === "A") {
                setOpacityA(0);
                activeRef.current = "B";
                if (current) {
                  current.pause();
                  current.currentTime = 0;
                }
              } else {
                setOpacityB(0);
                activeRef.current = "A";
                if (current) {
                  current.pause();
                  current.currentTime = 0;
                }
              }
              transitioningRef.current = false;
            }, 850);
          }).catch(() => {
            transitioningRef.current = false;
          });
        }
      }

      animFrame = requestAnimationFrame(checkTime);
    };

    animFrame = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-black">
      {/* Initial poster layer that dissolves once video starts */}
      {poster && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${poster})`,
            opacity: posterVisible ? 1 : 0,
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
        className="absolute inset-0 w-full h-full object-cover object-center will-change-opacity"
        style={{
          opacity: opacityA,
          zIndex: zIndexA,
          transition: "opacity 0.8s linear",
        }}
      />

      {/* Video B */}
      <video
        ref={videoB}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center will-change-opacity"
        style={{
          opacity: opacityB,
          zIndex: zIndexB,
          transition: "opacity 0.8s linear",
        }}
      />
    </div>
  );
}
