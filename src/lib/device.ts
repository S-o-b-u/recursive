/**
 * Client-only capability heuristics for trimming GPU + bandwidth cost on the
 * devices that actually feel it: phones, tablets, data-saver, slow links, and
 * anyone who asked for less motion.
 *
 * All of these read `false` during SSR and on the first server-rendered paint,
 * so components must resolve them in an effect and treat the heavy path as the
 * default that gets *downgraded* on the client — never the other way round, or
 * hydration mismatches and layout shift creep in.
 */

// biome-ignore lint/suspicious/noExplicitAny: navigator.connection is not typed
function connection(): any {
  if (typeof navigator === "undefined") return null;
  // biome-ignore lint/suspicious/noExplicitAny: vendor-prefixed on some engines
  const n = navigator as any;
  return n.connection || n.mozConnection || n.webkitConnection || null;
}

/** Data-saver on, or a 2g/3g-class link. */
export function prefersLessData(): boolean {
  const conn = connection();
  if (!conn) return false;
  if (conn.saveData) return true;
  return typeof conn.effectiveType === "string" && /(^|\b)[23]g\b/.test(conn.effectiveType);
}

/**
 * True when this client should be served the lightweight version of heavy
 * media (a still poster instead of a multi-megabyte autoplay video, a CSS
 * surface instead of a WebGL shader, …).
 */
export function prefersLiteMedia(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 860px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return coarse || small || reduce || prefersLessData();
  } catch {
    return false;
  }
}
