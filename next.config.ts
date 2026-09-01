import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
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
};

export default nextConfig;
