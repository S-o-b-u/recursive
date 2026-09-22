import type { NextConfig } from "next";

/**
 * Long-lived, content-addressed assets. Everything under /_next/static already
 * gets an immutable cache header from Next; the files in /public do not, so the
 * heavy media -- the hero plate, the poster, the track stills -- is re-validated
 * on every navigation unless we say otherwise. These filenames are stable and
 * the files are replaced wholesale when they change, so a long max-age is safe.
 */
const IMMUTABLE = "public, max-age=31536000, immutable";
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://*.devfolio.co",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://maps.google.com https://www.google.com https://www.openstreetmap.org",
  "upgrade-insecure-requests",
].join("; ");

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
        source: "/:path*",
        headers: [
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }]
            : []),
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
