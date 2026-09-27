/**
 * Time-of-day colour grade for the stage plate.
 *
 * The plate was rendered at golden hour. The hackathon runs 10:00 -> 18:00, so
 * the grade walks it from a fresh blue morning (the hero page's light) through
 * midday and afternoon to the untouched golden plate at 17:00 and on to dusk.
 * Each key is the full parameter set at that hour; hours in between blend with
 * a smoothstep so the light never visibly steps.
 *
 * The shader in StageScene applies these; the numbers were tuned against the
 * plate's own frames.
 */

export interface Grade {
  /** exposure multiplier */
  exp: number;
  /** white-balance gains */
  wb: [number, number, number];
  sat: number;
  /** contrast around mid grey */
  con: number;
  /** how much of the keyed sky is replaced by the zen -> hor gradient */
  sky: number;
  zen: [number, number, number];
  hor: [number, number, number];
  /** warm highlights pulled toward white light */
  wdes: number;
  /** golden grass pushed toward fresh green */
  grn: number;
  /** the low sun's glow at the right edge */
  sun: number;
  /**
   * How much of the plate's evening sun survives. The right-hand trees are
   * backlit by it; below 1 that zone is regraded as daylight like the left.
   */
  glow: number;
  /** colour lifted into the shadows */
  sh: [number, number, number];
  vig: number;
}

const KEYS: [number, Grade][] = [
  [10.0, { glow: 0.15, exp: 1.10, wb: [0.86, 0.98, 1.17], sat: 1.02, con: 0.95, sky: 0.92, zen: [0.42, 0.63, 0.92], hor: [0.90, 0.94, 0.97], wdes: 0.75, grn: 0.85, sun: 0.55, sh: [0.0, 0.012, 0.035], vig: 0.10 }],
  [12.5, { glow: 0.30, exp: 1.10, wb: [0.92, 0.99, 1.10], sat: 1.06, con: 1.00, sky: 0.78, zen: [0.38, 0.60, 0.92], hor: [0.94, 0.95, 0.93], wdes: 0.55, grn: 0.65, sun: 0.70, sh: [0.0, 0.006, 0.02], vig: 0.10 }],
  [15.0, { glow: 0.70, exp: 1.05, wb: [0.97, 1.00, 1.03], sat: 1.04, con: 1.00, sky: 0.40, zen: [0.45, 0.63, 0.90], hor: [1.00, 0.90, 0.74], wdes: 0.20, grn: 0.30, sun: 0.88, sh: [0.0, 0.0, 0.005], vig: 0.12 }],
  [17.0, { glow: 1.00, exp: 1.00, wb: [1.00, 1.00, 1.00], sat: 1.00, con: 1.00, sky: 0.00, zen: [0.45, 0.60, 0.85], hor: [1.00, 0.80, 0.55], wdes: 0.00, grn: 0.00, sun: 1.00, sh: [0.0, 0.0, 0.0], vig: 0.14 }],
  [18.0, { glow: 1.00, exp: 0.78, wb: [1.05, 0.92, 0.90], sat: 1.10, con: 1.06, sky: 0.45, zen: [0.30, 0.30, 0.52], hor: [1.00, 0.58, 0.38], wdes: 0.00, grn: 0.00, sun: 1.12, sh: [0.02, 0.0, 0.03], vig: 0.32 }],
];

export const DAY_START_HOUR = KEYS[0][0];
export const DAY_END_HOUR = KEYS[KEYS.length - 1][0];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: number[], b: number[], t: number): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export function gradeAt(hour: number): Grade {
  const h = Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR);
  let i = 0;
  while (i < KEYS.length - 2 && h > KEYS[i + 1][0]) i++;
  const [h0, a] = KEYS[i];
  const [h1, b] = KEYS[i + 1];
  let t = (h - h0) / (h1 - h0);
  t = t * t * (3 - 2 * t);
  return {
    exp: lerp(a.exp, b.exp, t),
    wb: lerp3(a.wb, b.wb, t),
    sat: lerp(a.sat, b.sat, t),
    con: lerp(a.con, b.con, t),
    sky: lerp(a.sky, b.sky, t),
    zen: lerp3(a.zen, b.zen, t),
    hor: lerp3(a.hor, b.hor, t),
    wdes: lerp(a.wdes, b.wdes, t),
    grn: lerp(a.grn, b.grn, t),
    sun: lerp(a.sun, b.sun, t),
    glow: lerp(a.glow, b.glow, t),
    sh: lerp3(a.sh, b.sh, t),
    vig: lerp(a.vig, b.vig, t),
  };
}
