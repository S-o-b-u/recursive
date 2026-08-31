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

    // On mobile and touch screens, native momentum scrolling is handled by GPU compositor at 120Hz.
    // We should NOT hijack touch scrolling with Lenis JS lerp on mobile.
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 860);

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: isTouch ? 0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouch,
      syncTouch: false,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;
    setLenis(lenis);
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    lenis.on('scroll', ScrollTrigger.update);

    // gsap.ticker time is in seconds; lenis.raf expects milliseconds.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    const triggerScrollExpand = (target: HTMLElement) => {
      const content =
        target.querySelector<HTMLElement>(
          ".section-inner, .acm-inner, .th-inner, .sp-inner, .cd-inner, .about-inner, .tracks-grid, .prize-pool-inner, .faq-inner"
        ) || target;

      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      gsap.killTweensOf(content);
      gsap.fromTo(
        content,
        {
          scale: 0.955,
          y: 24,
          opacity: 0.72,
          filter: "blur(5px)",
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "expo.out",
          delay: 0.18,
          clearProps: "scale,y,opacity,filter",
        }
      );

      target.classList.add("is-scroll-expanded");
      window.setTimeout(() => target.classList.remove("is-scroll-expanded"), 1400);
    };

    // Hash links (the hero's "scroll for lore", the nav anchors) execute
    // automatic scroll expand animations to seamlessly reveal the destination.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Same-page hashes only: "#themes" or "/#themes".
      const hash = href.startsWith("#")
        ? href
        : href.startsWith("/#") && window.location.pathname === "/"
          ? href.slice(1)
          : null;
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      triggerScrollExpand(target);
      window.history.pushState(null, "", hash);
    };

    const onCustomExpand = (event: Event) => {
      const customEvent = event as CustomEvent<{ target: HTMLElement | string }>;
      const target = typeof customEvent.detail?.target === "string"
        ? document.querySelector<HTMLElement>(customEvent.detail.target)
        : customEvent.detail?.target;
      if (target) triggerScrollExpand(target);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("recursive-scroll-expand", onCustomExpand);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("recursive-scroll-expand", onCustomExpand);
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
