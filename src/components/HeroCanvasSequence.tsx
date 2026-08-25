'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroCanvasSequenceProps {
  /** Path pattern for frames, e.g. "/sequences/recursive-bloom/frame-{num}.webp" */
  framePattern?: string;
  /** Number of frames in the sequence */
  frameCount?: number;
  /** Amount of scroll distance the sequence spans (e.g. "+=200%") */
  scrollDistance?: string;
}

export default function HeroCanvasSequence({
  framePattern = '/sequences/recursive-bloom/frame-{num}.webp',
  frameCount = 24,
  scrollDistance = '+=200%',
  children,
}: HeroCanvasSequenceProps & { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Keep track of loaded images to avoid re-fetching
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    // 1. Setup preloading
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      const paddedNum = String(i).padStart(3, '0');
      img.src = framePattern.replace('{num}', paddedNum);
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [frameCount, framePattern]);

  useEffect(() => {
    if (!imagesLoaded || !containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduced motion fallback
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, rect.width, rect.height);

      const imgRatio = img.width / img.height;
      const canvasRatio = rect.width / rect.height;
      
      let drawWidth = rect.width;
      let drawHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = rect.height * imgRatio;
        offsetX = (rect.width - drawWidth) / 2;
      } else {
        drawHeight = rect.width / imgRatio;
        offsetY = (rect.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    if (prefersReducedMotion) {
      // Fallback: render only the final "bloom" frame and don't pin
      renderFrame(frameCount - 1);
      const handleResize = () => renderFrame(frameCount - 1);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    // 2. Setup ScrollTrigger
    renderFrame(0);

    const playhead = { frame: 0 };

    const tl = gsap.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: scrollDistance,
        scrub: 0.5,
        pin: true,
      },
      onUpdate: () => renderFrame(playhead.frame)
    });

    const handleResize = () => renderFrame(playhead.frame);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [imagesLoaded, frameCount, scrollDistance]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[92vh] overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
        />
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-transparent">
            <div className="w-4 h-4 rounded-full border border-[var(--color-accent)] border-t-transparent animate-spin opacity-50" />
          </div>
        )}
      </div>
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
