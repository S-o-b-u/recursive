"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { EVENT } from "@/data/hackathon";
import WarpText from "@/components/ui/WarpText";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

export const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: Math.round(xDuration / yDuration),
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = new Image();
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        peep.walk?.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      let w = 0;
      let h = 0;
      ro = new ResizeObserver(() => {
        if (!canvas) return;
        const nw = canvas.clientWidth;
        const nh = canvas.clientHeight;
        if (Math.abs(nw - w) < 2 && Math.abs(nh - h) < 2) return;
        w = nw;
        h = nh;
        resize();
      });
      ro.observe(canvas);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 h-full w-full pointer-events-none"
    />
  );
};

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="footer-shell relative min-h-[clamp(320px,58vh,660px)] h-[clamp(320px,58vh,660px)] w-full bg-transparent text-[#142617] overflow-hidden select-none flex flex-col justify-end">
      {/* ── Soft luminous atmospheric aura & gradient lighting behind the wordmark ── */}
      <div className="footer-aurora" aria-hidden="true" />

      {/* ── Giant WebGL WarpText Wordmark behind the walking people with Rich Gradient ── */}
      <div className="footer-wordmark-wrap">
        <WarpText
          text={EVENT.name}
          color="linear-gradient(180deg, #070e08 0%, #0f1c12 36%, #1a301e 72%, #2c4e30 100%)"
          warpStrength={0.07}
          warpScale={1.6}
          speed={0.5}
          pointerInfluence={0.45}
          pointerStrength={0.4}
          refraction={0.016}
          ripple
          fontSize="clamp(5.5rem, 25.5vw, 36rem)"
          fontWeight={900}
          fontFamily="var(--font-heading), var(--font-dm-sans), sans-serif"
          letterSpacing="0.02em"
          lineHeight={0.88}
          style={{
            width: "100%",
            maxWidth: "100vw",
            height: "100%",
            pointerEvents: "auto",
          }}
        />
      </div>

      {/* ── Transparent gradient below the recursive logo ── */}
      <div className="footer-logo-gradient" aria-hidden="true" />

      {/* ── Whisper of ground under crowd ── */}
      <div className="footer-ground" aria-hidden="true" />

      {/* ── OpenPeeps Animated Crowd Canvas (z-20 in front of the giant letters) ── */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>

      {/* ── Floating Back to Top Button ── */}
      <div className="absolute bottom-6 right-6 pointer-events-auto" style={{ zIndex: 110 }}>
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group w-10 h-10 rounded-full bg-white/60 hover:bg-white/90 backdrop-blur-md border border-black/[0.08] hover:border-[#5C8C3A]/40 flex items-center justify-center text-[#142617] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden="true"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        /* ── Giant Wordmark behind the walking people ── */
        .footer-wordmark-wrap {
          position: absolute;
          inset-inline: 0;
          bottom: clamp(0.5rem, 4vh, 2.75rem);
          height: clamp(260px, 50vh, 580px);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          pointer-events: auto;
          user-select: none;
          padding-inline: clamp(0.2rem, 1.2vw, 1rem);
        }

        /* Luminous radial glow and aura behind the letters */
        .footer-aurora {
          position: absolute;
          inset: auto 0 0 0;
          height: 75%;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 50% 88%, rgba(143, 196, 90, 0.22) 0%, rgba(92, 140, 58, 0.06) 55%, transparent 85%),
            radial-gradient(ellipse 50% 40% at 15% 80%, rgba(200, 224, 180, 0.24) 0%, transparent 68%),
            radial-gradient(ellipse 50% 40% at 85% 80%, rgba(180, 215, 170, 0.24) 0%, transparent 68%);
        }

        /* Transparent fading gradient directly below the logo letters */
        .footer-logo-gradient {
          position: absolute;
          inset: auto 0 0 0;
          height: clamp(120px, 20vh, 240px);
          z-index: 12;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(239, 243, 235, 0.03) 25%,
            rgba(215, 228, 208, 0.18) 65%,
            rgba(188, 209, 180, 0.32) 100%
          );
        }

        /* Open sky between the panel above and the crowd, so the footer
           arrives as its own beat rather than butting straight onto ACM. */
        .footer-shell {
          margin-top: clamp(3rem, 8vh, 6.5rem);
        }

        /* A whisper of ground under the crowd, so they are standing on
           something rather than floating in the sky. */
        .footer-ground {
          position: absolute;
          inset: auto 0 0 0;
          height: 32%;
          z-index: 15;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(200, 214, 194, 0) 0%,
            rgba(190, 206, 182, 0.12) 50%,
            rgba(176, 194, 166, 0.26) 100%
          );
        }
      `}</style>
    </footer>
  );
}
