/**
 * `fluid("clamp(...)", "width")` — the value as written, except on old engines
 * without CSS math functions (Chrome < 79, classroom smartboards), where it is
 * evaluated to pixels for the current viewport by /legacy/css-compat.js.
 *
 * Only needed where React sets a clamp()/min()/max() on the client, or where
 * script reads a size back from one (WarpText's font probe): an old engine
 * rejects those silently. Values inside stylesheets are rewritten by the shim
 * itself, and server-rendered style attributes are too.
 */
type LegacyWindow = Window & { __legacyMath?: (value: string, prop?: string) => string };

export function fluid(value: string, prop = "width"): string {
  if (typeof window === "undefined") return value;
  const evaluate = (window as LegacyWindow).__legacyMath;
  return evaluate ? evaluate(value, prop) : value;
}
