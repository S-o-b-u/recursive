'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at module scope so every component that creates a
// ScrollTrigger shares the same (idempotent) plugin instance.
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced-motion: skip smooth scrolling entirely and let the
    // browser scroll natively. The Hero's own gsap.matchMedia() reduced branch
    // builds no pinning/scrubbing, so the page stays fully static + native.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    // Avoid pin recalculation thrash when the mobile URL bar shows/hides.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Lenis 1.x drives native window scroll (autoRaf defaults to false), so we
    // pump it from GSAP's ticker and keep ScrollTrigger in sync on every frame.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like ease-out
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // gsap.ticker time is in seconds; lenis.raf expects milliseconds.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
