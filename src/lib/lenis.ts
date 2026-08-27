import type Lenis from "lenis";

/**
 * Module singleton for the one Lenis instance <SmoothScroll> owns, so other
 * components (the intro's scroll lock / hand-off) can reach it without prop
 * drilling or a context provider.
 *
 * <SmoothScroll> runs in a passive effect and mounts after page-level layout
 * effects, so `getLenis()` can briefly return null on first paint — callers
 * that need it early should retry on rAF or wait for the `lenis:ready` event.
 */

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
  if (typeof window !== "undefined" && next) {
    window.dispatchEvent(new CustomEvent("lenis:ready"));
  }
}

export function getLenis(): Lenis | null {
  return instance;
}
