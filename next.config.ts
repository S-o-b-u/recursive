import type { NextConfig } from "next";

/**
 * Long-lived, content-addressed assets. Everything under /_next/static already
 * gets an immutable cache header from Next; the files in /public do not, so the
 * heavy media -- the hero plate, the poster, the track stills -- is re-validated
 * on every navigation unless we say otherwise. These filenames are stable and
 * the files are replaced wholesale when they change, so a long max-age is safe.
 */
const IMMUTABLE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  // Dev-only: stops `next dev` from generating AGENTS.md / CLAUDE.md at the root.
  agentRules: false,
  allowedDevOrigins: [
    "192.168.29.237",
    "192.168.29.237:3000",
    "192.168.67.1",
    "192.168.67.1:3000",
    "localhost:3000",
    "*.loca.lt",
    "blue-oranges-listen.loca.lt",
    "*.trycloudflare.com",
    "*.ngrok-free.app",
  ],
  async headers() {
    return [
      {
        // Baseline hardening. Deliberately no Content-Security-Policy: the page
        // carries inline <style> blocks, a WebGL/shader layer, the Devfolio SDK
        // and a Google Maps embed, so a policy written blind would break the
        // register button rather than protect anyone. Worth adding later, but
        // only alongside a pass that actually exercises those flows.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
      {
        source: "/bg/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        source: "/college_logo/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
    ];
  },
};

export default nextConfig;
