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

export const STAGE_VIDEO_SRC = "/videos/stage-loop-dof.mp4";
/**
 * The same loop at 1280x720, for smartboards (html.perf-lite): under half the
 * pixels to decode and scale, 24 times a second. The plate is soft by design
 * (its depth of field is baked in), so this costs almost nothing in looks.
 */
export const STAGE_VIDEO_LITE_SRC = "/videos/stage-loop-dof-720.mp4";

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
    v.src = perfLite() ? STAGE_VIDEO_LITE_SRC : STAGE_VIDEO_SRC;
    shared = v;
  }
  return shared;
}

/** Start the plate from inside a user gesture (see above). */
export function primeStageVideo(): void {
  try {
    stageVideo().play().catch(() => {});
  } catch {
    // play() is best effort; StageScene retries on the next tap.
  }
}
