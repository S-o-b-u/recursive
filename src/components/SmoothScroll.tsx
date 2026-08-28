'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from '@/lib/lenis';

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
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);

    // gsap.ticker time is in seconds; lenis.raf expects milliseconds.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hash links (the hero's "scroll for lore", the nav anchors) would otherwise
    // hard-jump: `scroll-behavior: smooth` is off because Lenis owns scrolling.
    // Delegate them to lenis.scrollTo so every in-page jump eases like the rest.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Brand logo / scroll to top when on home page
      if ((href === "/" || href === "#top" || href === "#") && window.location.pathname === "/") {
        event.preventDefault();
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        window.history.pushState(null, "", "/");
        return;
      }

      // Same-page hashes only: "#themes" or "/#themes".
      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -12,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
