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
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      // Multi-layer depth distribution:
      // depth 0 = front row (firmly overlaps the bottom floor)
      // depth 1 = back row (stands elevated behind the front row)
      const depth = Math.pow(Math.random(), 1.25);
      const scale = 1.02 + (1 - depth * 0.3) * 0.22;
      
      // Ground the front row deeply so they seamlessly meet and cross the bottom of the screen (+32px),
      // with back rows elevated by up to 72px so their heads rise up without exposing any cutoffs.
      const startY = stage.height - peep.height * scale + 32 - depth * 72;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width * scale - Math.random() * 80;
        endX = stage.width + peep.width * scale + Math.random() * 80;
        peep.scaleX = scale;
      } else {
        startX = stage.width + peep.width * scale + Math.random() * 80;
        endX = -peep.width * scale - Math.random() * 80;
        peep.scaleX = -scale;
      }

      peep.scaleY = scale;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    // biome-ignore lint/suspicious/noExplicitAny: External tween data
    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.6, 1.4));
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
          y: startY - 8,
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
      // biome-ignore lint/suspicious/noExplicitAny: Draw arguments
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      scaleY?: number;
      // biome-ignore lint/suspicious/noExplicitAny: Tween
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
        scaleY: 1,
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
          ctx.scale(peep.scaleX, peep.scaleY || Math.abs(peep.scaleX));
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
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

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

    return () => {
      window.removeEventListener("resize", handleResize);
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

  return (
    <footer className="relative h-screen w-full bg-transparent text-[#142617] overflow-hidden select-none">
      {/* ── Top Atmospheric Gradient: seamlessly dissolves the straight line between .night/ACM and Footer ── */}

      {/* ── Giant WebGL WarpText Wordmark across the upper section ── */}
      <div className="absolute top-[24%] sm:top-[26%] left-0 right-0 z-10 flex justify-center items-center px-4 pointer-events-auto">
        <WarpText
          text={EVENT.name}
          color="#2F5527"
          warpStrength={0.08}
          warpScale={1.7}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          fontSize="clamp(4.2rem, 14.5vw, 13rem)"
          fontWeight={900}
          fontFamily="var(--font-hiruko), sans-serif"
          letterSpacing="-0.015em"
          style={{
            width: "100%",
            maxWidth: "92rem",
            height: "clamp(150px, 22vw, 280px)",
            pointerEvents: "auto",
          }}
        />
      </div>

      <div className="footer-ground" aria-hidden="true" />

      {/* ── OpenPeeps Animated Crowd Canvas ── */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>

      <style>{`
        /* A whisper of ground under the crowd, so they are standing on
           something rather than floating in the sky. This replaces the old
           seam blend, which faded from black — it existed to join a dark ACM to
           a dark footer, and once the sponsor stage handed the page back to
           daylight it was painting a wall across the top of the cloud. */
        .footer-ground {
          position: absolute;
          inset: auto 0 0 0;
          height: 46%;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(200, 214, 194, 0) 0%,
            rgba(190, 206, 182, 0.18) 58%,
            rgba(176, 194, 166, 0.3) 100%
          );
        }
      `}</style>
    </footer>
  );
}
