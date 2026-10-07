/**
 * The stage plate's <video>, created once and reused across mounts.
 *
 * Some browsers only let a media element play if play() is first called on
 * that element inside a tap or key press: Android WebView-based browsers,
 * which is what many smartboards ship. StageScene mounts only after the
 * password screen, so its own play() comes too late and the plate sat on its
 * poster. The password submit calls primeStageVideo() while it still has the
 * key press, which unlocks this element for good, and StageScene adopts the
 * same element.
 */

import { perfLite } from "@/lib/device";

/** The loop at 1920x1080, 24 fps: what the graded WebGL backdrop draws (desktops). */
export const STAGE_VIDEO_SRC = "/videos/stage-loop-dof.mp4";
/** The same loop at 1280x720, 24 fps: the last resort on a board (see the ladder). */
export const STAGE_VIDEO_LITE_SRC = "/videos/stage-loop-dof-720.mp4";

/**
 * Which backdrop to run. Smartboards (html.perf-lite) get the plain video with
 * the CSS grade: on an Android 11 WebView it played the full frame rate on
 * about 60% of the main-thread time the shader took (every frame is copied
 * into a texture on the main thread), and the hardware decoder's output goes
 * straight to the compositor instead. `?grade=gl` or `?grade=video` overrides,
 * for comparing on a real board.
 */
export function wantShader(): boolean {
  const forced = new URLSearchParams(window.location.search).get("grade");
  if (forced === "gl") return true;
  if (forced === "video") return false;
  return !perfLite();
}

/**
 * The plain-video backdrop (smartboards), best first. The source is 24 fps,
 * and 24 does not divide a 60 Hz screen: its frames alternate between 3 and
 * 2 refreshes, which reads as a faint stutter in the swaying trees. These
 * copies have the in-between frames generated (motion interpolation of the
 * same 1080p master) at 60 and at 30 fps, which both divide 60 Hz evenly,
 * and they are full 1080p instead of 720p. Each step down is taken only if
 * the board drops frames or cannot decode the step above (stepDownStageVideo,
 * watched in StageScene), so every board gets the best it can actually play.
 * All three are the same 23.9 s loop.
 */
export const STAGE_VIDEO_BOARD_LADDER = [
  "/videos/stage-loop-dof-1080p60.mp4", // H.264 High, level 4.2
  "/videos/stage-loop-dof-1080p30.mp4", // H.264 High, level 4.0
  STAGE_VIDEO_LITE_SRC, // 720p, 24 fps
];

/** A step down is remembered on the board for this long, so it does not stutter on every reload. */
const RUNG_MEMORY_MS = 12 * 3600 * 1000;
const RUNG_KEY = "recursive:stage-video-rung";

function rememberedRung(): number {
  try {
    const saved = JSON.parse(window.localStorage.getItem(RUNG_KEY) || "null") as { rung: number; at: number } | null;
    if (saved && Date.now() - saved.at < RUNG_MEMORY_MS) {
      return Math.min(STAGE_VIDEO_BOARD_LADDER.length - 1, Math.max(0, saved.rung | 0));
    }
  } catch {}
  return 0;
}

let rung = 0;
let shared: HTMLVideoElement | null = null;

export function stageVideo(): HTMLVideoElement {
  if (!shared) {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = "auto";
    // Attributes too: older engines read these, not the properties.
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("aria-hidden", "true");
    // No cast button: Android Chromium overlays one on a video whenever a
    // cast device is on the network, which on a venue's wifi there may be.
    v.disableRemotePlayback = true;
    v.setAttribute("disableremoteplayback", "");
    if (wantShader()) {
      v.src = STAGE_VIDEO_SRC;
    } else {
      rung = rememberedRung();
      v.src = STAGE_VIDEO_BOARD_LADDER[rung];
    }
    shared = v;
  }
  return shared;
}

/** Which copy of the loop is playing (for logs and tests). */
export function stageVideoRung(): number {
  return rung;
}

/**
 * Switch the plain-video backdrop to the next copy down the ladder, at the
 * same point of the loop and still playing. False when already on the last.
 */
export function stepDownStageVideo(): boolean {
  const v = shared;
  if (!v || wantShader() || rung >= STAGE_VIDEO_BOARD_LADDER.length - 1) return false;
  const at = v.duration > 0 ? (v.currentTime % v.duration) / v.duration : 0;
  const playing = !v.paused;
  rung += 1;
  try {
    window.localStorage.setItem(RUNG_KEY, JSON.stringify({ rung, at: Date.now() }));
  } catch {}
  v.src = STAGE_VIDEO_BOARD_LADDER[rung];
  const resume = () => {
    v.removeEventListener("loadedmetadata", resume);
    if (v.duration > 0) v.currentTime = at * v.duration;
    if (playing) v.play().catch(() => {});
  };
  v.addEventListener("loadedmetadata", resume);
  v.load();
  return true;
}

/** Start the plate from inside a user gesture (see above). */
export function primeStageVideo(): void {
  try {
    stageVideo().play().catch(() => {});
  } catch {
    // play() is best effort; StageScene retries on the next tap.
  }
}
