"use client";

import { gsap } from "gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Executes a buttery-smooth, physics-based "Automatic Scroll Expand" animation:
 * 1. Dynamically adapts scroll velocity and expansion timing to the travel distance.
 * 2. Glides smoothly via Lenis with Apple-grade fluid momentum easing.
 * 3. Expands the target section container (scale 0.965 -> 1.0, y 28px -> 0px, blur 4px -> 0px)
 *    right as the scroll approaches the viewport.
 * 4. Stagger-expands child cards and stage elements with subtle physical spring momentum.
 * 5. Emits a soft, expansive radial ambient glow on arrival.
 */
export function triggerScrollExpand(
  targetInput: HTMLElement | string,
  options: { duration?: number; offset?: number } = {}
) {
  if (typeof window === "undefined") return;

  const target =
    typeof targetInput === "string"
      ? document.querySelector<HTMLElement>(targetInput)
      : targetInput;
  if (!target) return;

  const lenis = getLenis();
  const currentY = window.scrollY;
  const targetRect = target.getBoundingClientRect();
  const targetY = targetRect.top + currentY;
  const distance = Math.abs(targetY - currentY);

  // Dynamic travel duration based on distance (longer travel gets more luxurious glide)
  const scrollDuration =
    options.duration ??
    (distance > 2000 ? 1.65 : distance > 1000 ? 1.4 : distance > 400 ? 1.2 : 0.95);

  // Expand blooms right as the scroll approaches the target
  const expandDelay = distance > 800 ? Math.min(scrollDuration * 0.32, 0.44) : 0.06;

  // Primary content container within the section
  const content =
    target.querySelector<HTMLElement>(
      ".section-inner, .acm-inner, .th-inner, .sp-inner, .cd-inner, .about-inner, .tracks-grid, .prize-pool-inner, .faq-inner"
    ) || target;

  // Staggered interactive child cards/plates
  const childCards = target.querySelectorAll<HTMLElement>(
    ".th-stage, .th-brief, .judge-card-wrapper, .sp-row, .acm-logo-plate, .cd-clock-wrapper, .about-core"
  );

  // 1. Smooth scroll to target with fluid Apple curve
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: scrollDuration,
      easing: (t) => 1 - Math.pow(1 - t, 4.2),
    });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }

  // 2. Ultra-smooth physical expansion on the targeted section
  gsap.killTweensOf(content);
  if (childCards.length) gsap.killTweensOf(childCards);

  gsap.fromTo(
    content,
    {
      scale: 0.965,
      y: 28,
      opacity: 0.78,
      filter: "blur(4px)",
      transformOrigin: "50% 20%",
    },
    {
      scale: 1,
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.25,
      ease: "power3.out",
      delay: expandDelay,
      clearProps: "scale,y,opacity,filter,transformOrigin",
    }
  );

  // 3. Stagger-expand child cards
  if (childCards.length) {
    gsap.fromTo(
      childCards,
      {
        scale: 0.975,
        y: 16,
        opacity: 0.82,
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.04,
        ease: "power3.out",
        delay: expandDelay + 0.1,
        clearProps: "scale,y,opacity",
      }
    );
  }

  // 4. Soft expansion ambient glow
  target.classList.add("is-scroll-expanded");
  window.setTimeout(() => target.classList.remove("is-scroll-expanded"), 1800);
}
