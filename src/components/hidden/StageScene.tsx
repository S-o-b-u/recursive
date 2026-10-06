"use client";

import React, { useEffect, useRef, useState } from "react";
import { gradeAt, DAY_START_HOUR, DAY_END_HOUR } from "./day-grade";
import { perfLite } from "@/lib/device";
import { stageVideo } from "./stage-video";

interface StageSceneProps {
  /** Clock hour the plate should be lit for (10 = morning ... 18 = dusk). */
  hour: number;
  poster?: string;
}

/**
 * The stage backdrop: the chair-on-the-hill loop, graded live for the time of day.
 *
 * One <video> (a forward+reverse palindrome, so a plain `loop` is seamless) is
 * uploaded to a WebGL texture on every new frame and drawn through the grade
 * in day-grade.ts. The near-field depth of field is baked into the video
 * itself, so the shader only has to colour it. The element itself comes from
 * stage-video.ts, so the password screen can start it.
 *
 * The grade needs to know where the sky is, and a pixel's colour alone cannot
 * tell a sunlit sky from a sunlit leaf, so /images/stage/stage-masks.png
 * carries a sky map of the (static) camera: R = where sky can appear (the
 * leaves sway through it, so it is generous and the shader separates sky
 * from foliage per pixel by smoothness), B = the zone around the chair where
 * the white plastic must not be read as sky.
 *
 * Without WebGL, on a smartboard, or where the shader cannot get the video's
 * frames, the video is shown as-is under a CSS grade (exposure, colour and
 * contrast for the hour, but the evening sky).
 */

const MASK_SRC = "/images/stage/stage-masks.png";
const VIDEO_ASPECT = 1920 / 1080;
/** The plate's frame rate. */
const VIDEO_FPS = 24;
/** Seconds for the light to catch up when the clock jumps (reset, milestone click). */
const HOUR_EASE_S = 0.9;
/** Longest backing-store edge; the plate is 1080p, more pixels add nothing. */
const MAX_BACKING = 2560;
/** The same on a smartboard (html.perf-lite): 720p of backing, scaled up by the compositor. */
const LITE_BACKING = 1280;
/** The watchdog never draws fewer than this share of the backing size. */
const MIN_SCALE = 0.5;
/** A hour change smaller than this (43 clock seconds) snaps; larger ones sweep. */
const HOUR_SNAP = 0.012;
/** The video frame whose drawn output is checked for black (see outputIsBlack). */
const BLACK_CHECK_FRAME = 3;

/**
 * Which backdrop to run. Smartboards (html.perf-lite) get the plain video with
 * the CSS grade: on an Android 11 WebView it played the full 24 frames a second
 * on about 60% of the main-thread time the shader took, where the shader
 * managed 20 (every frame is copied into a texture on the main thread). The
 * hardware decoder's output goes straight to the compositor instead.
 * `?grade=gl` or `?grade=video` overrides, for comparing on a real board.
 */
function wantShader() {
  const forced = new URLSearchParams(window.location.search).get("grade");
  if (forced === "gl") return true;
  if (forced === "video") return false;
  return !perfLite();
}

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform sampler2D uFrame;
uniform sampler2D uMask;
uniform vec4 uCover;
uniform vec2 uTexel;
uniform float uExp, uSat, uCon, uSky, uWdes, uGrn, uSun, uGlow, uVig, uSeed;
uniform vec3 uWb, uZen, uHor, uSh;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

float leafKey(vec3 c) {
  return smoothstep(0.04, 0.12, c.g - c.b) * smoothstep(-0.10, 0.0, c.g - c.r);
}
// how much a colour reads as open sky, from colour alone (m = the mask texel)
float skyColourKey(vec3 c, float L, vec3 m) {
  float mx = max(c.r, max(c.g, c.b));
  float sat = (mx - min(c.r, min(c.g, c.b))) / max(mx, 1e-4);
  // near the chair, only saturated pixels are sky: the white plastic is not
  return m.r * smoothstep(0.30, 0.55, L) * mix(1.0, smoothstep(0.14, 0.28, sat), m.b) * (1.0 - leafKey(c));
}
// every step of the grade except the sky swap
vec3 baseGrade(vec3 c, float L, float gm, float sunz) {
  float warm = clamp((c.r - c.b) * 1.6, 0.0, 1.0);
  float hi = smoothstep(0.40, 0.85, L);
  // warm highlights -> white light; the sun's own glow stays warm-white, never cyan
  vec3 x = mix(c, L * mix(vec3(1.0), vec3(1.04, 1.0, 0.90), sunz), uWdes * warm * hi * (1.0 - gm));
  x *= 1.0 + (uSun - 1.0) * sunz * hi;
  x *= mix(uWb, vec3(1.0, 0.99, 0.96), sunz * hi) * uExp;
  return x * (1.0 - gm * uGrn * vec3(0.30, -0.03, -0.10));
}

void main() {
  vec2 p = vUv * uCover.xy + uCover.zw;
  vec2 dx = vec2(uTexel.x * 2.0, 0.0);
  vec2 dy = vec2(0.0, uTexel.y * 2.0);
  vec3 c = texture2D(uFrame, p).rgb;
  vec3 n0 = texture2D(uFrame, p - dx).rgb;
  vec3 n1 = texture2D(uFrame, p + dx).rgb;
  vec3 n2 = texture2D(uFrame, p - dy).rgb;
  vec3 n3 = texture2D(uFrame, p + dy).rgb;
  vec3 m = texture2D(uMask, p).rgb;

  float L = dot(c, LUMA);
  vec4 nl = vec4(dot(n0, LUMA), dot(n1, LUMA), dot(n2, LUMA), dot(n3, LUMA));

  // Sky is smooth and foliage is not. The mean of the middle two neighbour
  // steps ignores a single leafy neighbour, so sky right beside a leaf still
  // counts as sky.
  vec4 d = abs(L - nl);
  float tex = (d.x + d.y + d.z + d.w - max(max(d.x, d.y), max(d.z, d.w)) - min(min(d.x, d.y), min(d.z, d.w))) * 0.5;
  float skyk = skyColourKey(c, L, m) * (1.0 - smoothstep(0.018, 0.05, tex));

  // The low sun sits behind the right-hand trees. It belongs to the evening
  // plate, so earlier in the day most of its glow is taken out (tame) and only
  // uGlow of it keeps the golden treatment (sunz).
  float sunRaw = 1.0 - smoothstep(0.0, 0.55, length(vec2((p.x - 0.985) * 1.78, p.y - 0.46)));
  float sunz = sunRaw * uGlow;
  float tame = sunRaw * (1.0 - uGlow);
  // grass and leaves, but not backlit glow
  float gm = smoothstep(0.02, 0.10, c.g - c.b) * smoothstep(-0.04, 0.05, c.g - c.r * 0.9) * (1.0 - skyk);
  gm *= (1.0 - smoothstep(0.52, 0.78, L)) * (1.0 - 0.85 * sunz);

  // the hour's sky: zenith -> horizon, keeping some of the plate's own glow
  vec3 skyc = mix(uHor, uZen, pow(clamp(1.0 - p.y / 0.60, 0.0, 1.0), 1.15));
  float sl = max(dot(skyc, LUMA), 1e-3);

  vec3 bc = baseGrade(c, L, gm, sunz);
  vec3 x = bc + skyk * uSky * (skyc * (1.0 + (L / sl - 1.0) * 0.35) - bc);

  // A leaf's edge pixel is part leaf, part old sky. Swap just the sky share,
  // measured against the brightest neighbour (the sky beside it), or every
  // leaf keeps a thin outline of the old sky.
  vec3 S = n0;
  float LS = nl.x;
  if (nl.y > LS) { S = n1; LS = nl.y; }
  if (nl.z > LS) { S = n2; LS = nl.z; }
  if (nl.w > LS) { S = n3; LS = nl.w; }
  float Lmin = min(L, min(min(nl.x, nl.y), min(nl.z, nl.w)));
  float share = clamp((L - Lmin) / max(LS - Lmin, 1e-3), 0.0, 1.0);
  float kS = skyColourKey(S, LS, m);
  x += (1.0 - skyk) * (1.0 - sunz) * share * kS * uSky
     * (skyc * (1.0 + (LS / sl - 1.0) * 0.35) - baseGrade(S, LS, 0.0, sunz));

  // backlit trees -> the left side's daylight: warm rim light neutralised,
  // leaves greener, contrast pulled toward the mid tone
  float t = tame * (1.0 - skyk);
  float Lq = dot(x, LUMA);
  x = mix(x, Lq * vec3(1.0, 1.0, 0.94), t * clamp((x.r - x.b) * 1.6, 0.0, 1.0) * 0.6);
  x *= 1.0 - t * smoothstep(0.08, 0.30, Lq) * (1.0 - smoothstep(0.55, 0.85, Lq)) * vec3(0.22, -0.06, 0.0);
  Lq = dot(x, LUMA);
  x *= mix(Lq, 0.34, t * 0.40) / max(Lq, 1e-3);

  float Lx = dot(x, LUMA);
  x = mix(vec3(Lx), x, uSat);
  x = (x - 0.45) * uCon + 0.45;
  x += uSh * (1.0 - smoothstep(0.0, 0.5, Lx));
  x *= 1.0 - uVig * smoothstep(0.35, 0.95, length(vec2((p.x - 0.5) * 1.3, p.y - 0.47)));

  // the replaced sky is a smooth gradient: dither it so 8-bit output does not band
  float n = fract(sin(dot(gl_FragCoord.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(clamp(x + (n - 0.5) / 255.0, 0.0, 1.0), 1.0);
}`;

type Uniforms = Record<string, WebGLUniformLocation | null>;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[stage] shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function makeTexture(gl: WebGLRenderingContext) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return t;
}

export default function StageScene({
  hour,
  poster = "/videos/stage-poster-dof.jpg",
}: StageSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoHostRef = useRef<HTMLDivElement>(null);
  const targetHour = useRef(hour);
  const wakeRef = useRef<(() => void) | null>(null);
  const [mode, setMode] = useState<"pending" | "gl" | "video">("pending");
  const [drawn, setDrawn] = useState(false);

  targetHour.current = Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR);

  // The light changed; draw it (when the video is playing, its next frame does this anyway).
  useEffect(() => {
    wakeRef.current?.();
  }, [hour]);

  useEffect(() => {
    const host = videoHostRef.current;
    if (!host) return;
    const video = stageVideo();
    video.className = "absolute inset-0 w-full h-full object-cover object-center";
    host.appendChild(video);

    // Keep it playing. Where every play() needs a gesture and the password
    // screen's did not take, the first tap or key press anywhere starts it.
    const kick = () => {
      if (video.paused && !document.hidden) video.play().catch(() => {});
    };
    const gestures = ["pointerup", "touchend", "mousedown", "keydown", "click"];
    for (const type of gestures) window.addEventListener(type, kick, true);
    video.addEventListener("canplay", kick);
    document.addEventListener("visibilitychange", kick);
    kick();

    return () => {
      for (const type of gestures) window.removeEventListener(type, kick, true);
      video.removeEventListener("canplay", kick);
      document.removeEventListener("visibilitychange", kick);
      video.pause();
      video.remove();
    };
  }, []);

  // The video stays visible under the canvas, which covers it once drawn.
  // Older Android engines stop handing a video they are not showing fresh
  // frames, and the canvas only ever gets what the element has.
  useEffect(() => {
    const video = stageVideo();
    // Ungraded fallback: show the poster until the first frame.
    if (mode === "video") video.poster = poster;
    else video.removeAttribute("poster");
  }, [mode, poster]);

  // Without the shader (no WebGL, or a device too slow for it) the plain video
  // still follows the hour in exposure, colour and contrast: a CSS filter is a
  // colour matrix, which the compositor applies for next to nothing. It cannot
  // swap the sky, so the morning is a brighter evening rather than a blue one.
  useEffect(() => {
    const video = stageVideo();
    if (mode !== "video") {
      video.style.filter = "";
      return;
    }
    const g = gradeAt(Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR));
    // Always a filter, even at 17:00 where it changes nothing: without one,
    // Android hands the video to a separate overlay surface, a mode switch
    // twice a day that page screenshots (and some capture tools) see as black.
    video.style.filter = `brightness(${g.exp.toFixed(3)}) saturate(${g.sat.toFixed(3)}) contrast(${g.con.toFixed(3)})`;
  }, [mode, hour]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const video = stageVideo();
    if (!wantShader()) {
      setMode("video");
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("[stage] no WebGL: showing the plain video");
      setMode("video");
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setMode("video");
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[stage] link:", gl.getProgramInfoLog(prog));
      setMode("video");
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // one triangle covering the viewport
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u: Uniforms = {};
    for (const name of ["uFrame", "uMask", "uCover", "uTexel", "uExp", "uSat", "uCon", "uSky", "uWdes", "uGrn", "uSun", "uGlow", "uVig", "uSeed", "uWb", "uZen", "uHor", "uSh"]) {
      u[name] = gl.getUniformLocation(prog, name);
    }
    gl.uniform1i(u.uFrame, 0);
    gl.uniform1i(u.uMask, 1);
    gl.uniform2f(u.uTexel, 1 / 1920, 1 / 1080);

    const frameTex = makeTexture(gl);
    const maskTex = makeTexture(gl);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    let disposed = false;
    let lost = false;
    let gaveUp = false; // frames never reached the texture: plain video instead
    let hasFrame = false; // something (poster or video) is in frameTex
    let hasMask = false;
    let videoLive = false; // frameTex holds a video frame
    let needsDraw = true;
    let shownHour = targetHour.current;
    let lastStep = performance.now();
    let lastFrameAt = -1e9; // when the last video frame reached the texture
    let scale = 1; // share of the full backing size actually drawn; the watchdog lowers it
    let raf = 0;
    let vfc = 0;

    const upload = (unit: number, tex: WebGLTexture | null, source: TexImageSource) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        return true;
      } catch {
        return false;
      }
    };

    // Nothing here loops on its own. A frame is drawn when a new video frame
    // arrives (requestVideoFrameCallback), or, when none is arriving (the
    // poster, a paused video, an engine without that callback), on the next
    // animation frame after something changed. It used to run a requestAnimationFrame
    // loop for the page's whole life and redraw the shader on every one of
    // those frames, 60 a second, for a plate that has 24.
    // `tick` is assigned below; the first resize() wakes the loop before that, so
    // the frame goes through this wrapper, which reads `tick` when it runs.
    let tick: FrameRequestCallback = () => {};
    const onFrame: FrameRequestCallback = (now) => {
      raf = 0;
      tick(now);
    };
    const wake = () => {
      if (disposed || raf) return;
      raf = requestAnimationFrame(onFrame);
    };

    const mask = new Image();
    mask.decoding = "async";
    mask.onload = () => {
      if (disposed || lost) return;
      hasMask = upload(1, maskTex, mask);
      needsDraw = true;
      wake();
    };
    mask.src = MASK_SRC;

    // The poster is graded too, so the first thing on screen is already in the right light.
    const still = new Image();
    still.decoding = "async";
    still.onload = () => {
      if (disposed || lost || videoLive) return;
      hasFrame = upload(0, frameTex, still);
      needsDraw = true;
      wake();
    };
    still.src = poster;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      // smartboards: the plate is 1080p and soft (its depth of field is baked in),
      // and a 4K panel's GPU is better spent elsewhere
      const r = Math.min(window.devicePixelRatio || 1, (perfLite() ? LITE_BACKING : MAX_BACKING) / Math.max(w, h)) * scale;
      const bw = Math.max(1, Math.round(w * r));
      const bh = Math.max(1, Math.round(h * r));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        needsDraw = true;
        wake();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      const g = gradeAt(shownHour);
      const aspect = canvas.width / canvas.height;
      // object-fit: cover, centred
      if (aspect > VIDEO_ASPECT) {
        const s = VIDEO_ASPECT / aspect;
        gl.uniform4f(u.uCover, 1, s, 0, (1 - s) / 2);
      } else {
        const s = aspect / VIDEO_ASPECT;
        gl.uniform4f(u.uCover, s, 1, (1 - s) / 2, 0);
      }
      gl.uniform1f(u.uExp, g.exp);
      gl.uniform1f(u.uSat, g.sat);
      gl.uniform1f(u.uCon, g.con);
      gl.uniform1f(u.uSky, g.sky);
      gl.uniform1f(u.uWdes, g.wdes);
      gl.uniform1f(u.uGrn, g.grn);
      gl.uniform1f(u.uSun, g.sun);
      gl.uniform1f(u.uGlow, g.glow);
      gl.uniform1f(u.uVig, g.vig);
      gl.uniform1f(u.uSeed, (performance.now() % 997) * 0.37);
      gl.uniform3fv(u.uWb, g.wb);
      gl.uniform3fv(u.uZen, g.zen);
      gl.uniform3fv(u.uHor, g.hor);
      gl.uniform3fv(u.uSh, g.sh);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // Some Android WebViews hand WebGL a video frame as solid black, with no
    // error anywhere. Read back three rows of what was just drawn (the plate
    // is never dark enough to be all black) before it is presented.
    const outputIsBlack = () => {
      const w = canvas.width;
      const row = new Uint8Array(w * 4);
      let peak = 0;
      for (const at of [0.3, 0.5, 0.7]) {
        gl.readPixels(0, Math.floor(canvas.height * at), w, 1, gl.RGBA, gl.UNSIGNED_BYTE, row);
        for (let i = 0; i < row.length; i += 4) peak = Math.max(peak, row[i], row[i + 1], row[i + 2]);
      }
      return peak < 8;
    };

    let drawnOnce = false;
    let videoDraws = 0;
    const render = () => {
      if (!needsDraw || !hasFrame || !hasMask) return;
      needsDraw = false;
      draw();
      if (videoLive && ++videoDraws === BLACK_CHECK_FRAME && outputIsBlack()) {
        console.warn("[stage] video frames reach the shader black: showing the plain video");
        gaveUp = true;
        setMode("video");
        return;
      }
      if (!drawnOnce) {
        drawnOnce = true;
        setDrawn(true);
      }
    };

    /**
     * Move the light toward the clock. The clock's own creep (a second at a
     * time) is far below what the eye can see, so it snaps; a jump (reset,
     * milestone click) sweeps rather than cuts. True while still moving.
     */
    const stepHour = (now: number) => {
      const dt = Math.min(0.25, Math.max(0, (now - lastStep) / 1000));
      lastStep = now;
      const target = targetHour.current;
      const diff = target - shownHour;
      if (diff === 0) return false;
      if (Math.abs(diff) < HOUR_SNAP) shownHour = target;
      else shownHour += diff * (1 - Math.exp(-dt / HOUR_EASE_S));
      if (Math.abs(target - shownHour) < 1e-4) shownHour = target;
      needsDraw = true;
      return shownHour !== target;
    };

    let uploads = 0; // video frames that reached the texture
    const takeVideoFrame = () => {
      if (!lost && video.readyState >= 2 && upload(0, frameTex, video)) {
        hasFrame = true;
        videoLive = true;
        needsDraw = true;
        lastFrameAt = performance.now();
        uploads++;
      }
    };

    let useVfc = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const onVideoFrame = (now: number) => {
      vfc = 0;
      if (disposed || lost || gaveUp || !useVfc) return;
      takeVideoFrame();
      stepHour(now);
      render();
      vfc = video.requestVideoFrameCallback(onVideoFrame);
    };
    if (useVfc) vfc = video.requestVideoFrameCallback(onVideoFrame);

    let lastFrameIdx = -1;
    tick = (now: number) => {
      if (disposed || lost || gaveUp) return;
      let again = false;

      // No requestVideoFrameCallback (or it stalled): poll, once per video frame.
      if (!useVfc && !video.paused) {
        again = true;
        if (video.readyState >= 2) {
          const idx = Math.floor(video.currentTime * VIDEO_FPS);
          if (idx !== lastFrameIdx) {
            lastFrameIdx = idx;
            takeVideoFrame();
          }
        }
      }

      // While frames flow, their callback moves the light; here only when they do not.
      if (!useVfc || performance.now() - lastFrameAt > 300) {
        if (stepHour(now)) again = true;
      }
      render();
      if (again) wake();
    };
    wakeRef.current = wake;
    wake();
    setMode("gl");

    // Once a second: are frames getting through, and in time?
    let watchT = -1;
    let watchN = 0;
    let late = 0;
    const watchdog = window.setInterval(() => {
      if (disposed || lost || gaveUp) return;
      // Not playing, or nobody is looking (a background tab stops presenting
      // frames, which would read as a stall): nothing to judge.
      if (video.paused || video.readyState < 3 || document.hidden) {
        watchT = -1;
        late = 0;
        return;
      }
      const ct = video.currentTime;
      if (watchT < 0 || ct < watchT) {
        watchT = ct; // first look, or the loop wrapped
        watchN = uploads;
        return;
      }
      if (ct - watchT < 2) return;
      const rate = (uploads - watchN) / (ct - watchT); // frames drawn per second of the plate
      watchT = ct;
      watchN = uploads;

      // Playing but its frames are not arriving here through the video
      // callback (some engines run requestVideoFrameCallback at a few Hz, or
      // not at all): poll instead.
      if (useVfc && rate < VIDEO_FPS / 3) {
        late = 0;
        console.info("[stage] video frame callbacks are slow (" + rate.toFixed(1) + "/s): polling instead");
        useVfc = false;
        if (vfc) video.cancelVideoFrameCallback(vfc);
        vfc = 0;
        wake();
        return;
      }

      // Nothing at all is getting through (the upload is refused): show the
      // plain video. Moving and ungraded beats graded and frozen.
      if (rate < 1) {
        console.warn("[stage] video frames are not reaching the shader (" + rate.toFixed(1) + "/s): showing the plain video");
        gaveUp = true;
        setMode("video");
        return;
      }

      // Frames get through, but late: this device cannot draw the plate at
      // full size. Two slow windows running, draw 3/4 as many pixels (down to
      // half the width), as many times as it takes.
      if (rate < VIDEO_FPS * 0.75 && scale > MIN_SCALE) {
        if (++late >= 2) {
          late = 0;
          scale = Math.max(MIN_SCALE, scale * 0.75);
          console.info("[stage] drawing at " + Math.round(scale * 100) + "% size (" + rate.toFixed(1) + " frames/s)");
          resize();
        }
      } else {
        late = 0;
      }
    }, 1000);

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      console.warn("[stage] WebGL context lost: showing the plain video");
      setMode("video");
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      wakeRef.current = null;
      window.clearInterval(watchdog);
      cancelAnimationFrame(raf);
      if (vfc) video.cancelVideoFrameCallback(vfc);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      mask.onload = null;
      still.onload = null;
      if (!lost) {
        gl.deleteTexture(frameTex);
        gl.deleteTexture(maskTex);
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        // No loseContext(): a canvas hands the same context back to the next
        // getContext() call, so under StrictMode's mount -> unmount -> mount
        // the remount would inherit a dead context.
      }
    };
  }, [poster]);

  const graded = mode === "gl";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-black">
      {/* Holds the shared <video>, which is also the fallback: shown
          ungraded when WebGL is unavailable. */}
      <div ref={videoHostRef} className="absolute inset-0" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: graded && drawn ? 1 : 0,
          transition: "opacity 0.9s ease",
          display: mode === "video" ? "none" : "block",
        }}
      />
    </div>
  );
}
