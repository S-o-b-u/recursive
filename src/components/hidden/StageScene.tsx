"use client";

import React, { useEffect, useRef, useState } from "react";
import { gradeAt, DAY_START_HOUR, DAY_END_HOUR } from "./day-grade";

interface StageSceneProps {
  /** Clock hour the plate should be lit for (10 = morning ... 18 = dusk). */
  hour: number;
  src?: string;
  poster?: string;
}

/**
 * The stage backdrop: the chair-on-the-hill loop, graded live for the time of day.
 *
 * One <video> (a forward+reverse palindrome, so a plain `loop` is seamless) is
 * uploaded to a WebGL texture on every new frame and drawn through the grade
 * in day-grade.ts. The near-field depth of field is baked into the video
 * itself, so the shader only has to colour it.
 *
 * The grade needs to know where the sky is, and a pixel's colour alone cannot
 * tell a sunlit sky from a sunlit leaf, so /images/stage/stage-masks.png
 * carries a sky map of the (static) camera: R = where sky can appear (the
 * leaves sway through it, so it is generous and the shader separates sky
 * from foliage per pixel by smoothness), B = the zone around the chair where
 * the white plastic must not be read as sky.
 *
 * Without WebGL the video is shown as-is, ungraded.
 */

const MASK_SRC = "/images/stage/stage-masks.png";
const VIDEO_ASPECT = 1920 / 1080;
/** Seconds for the light to catch up when the clock jumps (reset, milestone click). */
const HOUR_EASE_S = 0.9;
/** Longest backing-store edge; the plate is 1080p, more pixels add nothing. */
const MAX_BACKING = 2560;

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
  src = "/videos/stage-loop-dof.mp4",
  poster = "/videos/stage-poster-dof.jpg",
}: StageSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetHour = useRef(hour);
  const [mode, setMode] = useState<"pending" | "gl" | "video">("pending");
  const [drawn, setDrawn] = useState(false);

  targetHour.current = Math.min(Math.max(hour, DAY_START_HOUR), DAY_END_HOUR);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;
    if (!gl) {
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
    let hasFrame = false; // something (poster or video) is in frameTex
    let hasMask = false;
    let videoLive = false; // frameTex holds a video frame
    let needsDraw = true;
    let shownHour = targetHour.current;
    let last = performance.now();
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

    const mask = new Image();
    mask.decoding = "async";
    mask.onload = () => {
      if (disposed || lost) return;
      hasMask = upload(1, maskTex, mask);
      needsDraw = true;
    };
    mask.src = MASK_SRC;

    // The poster is graded too, so the first thing on screen is already in the right light.
    const still = new Image();
    still.decoding = "async";
    still.onload = () => {
      if (disposed || lost || videoLive) return;
      hasFrame = upload(0, frameTex, still);
      needsDraw = true;
    };
    still.src = poster;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const r = Math.min(window.devicePixelRatio || 1, MAX_BACKING / Math.max(w, h));
      const bw = Math.max(1, Math.round(w * r));
      const bh = Math.max(1, Math.round(h * r));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        needsDraw = true;
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

    const onVideoFrame = () => {
      if (disposed) return;
      if (!lost && video.readyState >= 2 && upload(0, frameTex, video)) {
        hasFrame = true;
        videoLive = true;
        needsDraw = true;
      }
      vfc = video.requestVideoFrameCallback(onVideoFrame);
    };
    const hasVfc = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    if (hasVfc) vfc = video.requestVideoFrameCallback(onVideoFrame);
    let lastVideoTime = -1;
    let drawnOnce = false;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (lost) return;
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;

      // No requestVideoFrameCallback: poll for a new frame instead.
      if (!hasVfc && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        if (upload(0, frameTex, video)) {
          hasFrame = true;
          videoLive = true;
          needsDraw = true;
        }
      }

      // The light follows the clock; a jump (reset, milestone click) sweeps rather than cuts.
      const target = targetHour.current;
      if (Math.abs(target - shownHour) > 1e-4) {
        shownHour += (target - shownHour) * (1 - Math.exp(-dt / HOUR_EASE_S));
        if (Math.abs(target - shownHour) < 1e-4) shownHour = target;
        needsDraw = true;
      }

      if (needsDraw && hasFrame && hasMask) {
        needsDraw = false;
        draw();
        if (!drawnOnce) {
          drawnOnce = true;
          setDrawn(true);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    setMode("gl");

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      setMode("video");
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (hasVfc && vfc) video.cancelVideoFrameCallback(vfc);
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
      {/* Also the fallback: shown ungraded when WebGL is unavailable. */}
      <video
        ref={videoRef}
        src={src}
        poster={graded ? undefined : poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: mode === "video" ? 1 : 0 }}
      />
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
