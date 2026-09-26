"use client";

import React from "react";

interface SvgNeonDigitProps {
  digit: string;
  isAmber?: boolean;
  width?: number;
  height?: number;
}

/**
 * Geometric neon-outline digit matching the user's mockup:
 * Exact 40x61 viewBox scaled up
 */
export default function SvgNeonDigit({
  digit,
  isAmber = false,
  width = 52,
  height = 79,
}: SvgNeonDigitProps) {
  const strokeColor = isAmber ? "#bef264" : "#000000";
  const glowShadow = isAmber
    ? "drop-shadow(0 0 7px rgba(190, 242, 100, 0.95)) drop-shadow(0 0 20px rgba(163, 230, 53, 0.55)) drop-shadow(0 0 40px rgba(132, 204, 22, 0.25))"
    : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.3))";

  const renderDigit = () => {
    switch (digit) {
      case "0":
        return (
          <>
            <rect
              x="3"
              y="3"
              width="34"
              height="55"
              rx="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
            />
            <line
              x1="9"
              y1="46"
              x2="31"
              y2="15"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </>
        );

      case "1":
        return (
          <>
            <line
              x1="20"
              y1="3"
              x2="20"
              y2="58"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="12"
              x2="20"
              y2="3"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <line
              x1="9"
              y1="58"
              x2="31"
              y2="58"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </>
        );

      case "2":
        return (
          <path
            d="M 6,18 C 6,9 13,3 20,3 C 28,3 34,8 34,16 C 34,26 23,35 6,58 L 34,58"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "3":
        return (
          <path
            d="M 6,3 L 34,3 C 34,14 26,22 20,22 C 28,22 34,28 34,38 C 34,50 26,58 18,58 C 10,58 6,53 6,48"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "4":
        return (
          <>
            <path
              d="M 28,3 L 6,36 L 34,36"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="28"
              y1="3"
              x2="28"
              y2="58"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </>
        );

      case "5":
        return (
          <path
            d="M 32,3 L 8,3 L 8,24 C 14,21 26,21 31,24 C 35,28 36,37 33,48 C 29,55 20,58 12,58 C 8,58 5,56 5,53"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "6":
        return (
          <path
            d="M 31,6 C 18,6 6,16 6,33 C 6,47 14,58 24,58 C 32,58 34,50 34,41 C 34,31 24,28 14,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "7":
        return (
          <path
            d="M 6,3 L 34,3 L 15,58"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "8":
        return (
          <path
            d="M 20,3 C 30,3 37,9 37,17 C 37,25 30,30 20,30 C 10,30 3,25 3,17 C 3,9 10,3 20,3 Z
               M 20,31 C 30,31 37,36 37,44 C 37,52 30,58 20,58 C 10,58 3,52 3,44 C 3,36 10,31 20,31 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "9":
        return (
          <path
            d="M 9,55 C 22,55 34,45 34,28 C 34,14 26,3 16,3 C 8,3 6,11 6,20 C 6,30 16,33 26,31"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 40 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        color: strokeColor,
        filter: glowShadow,
        display: "block",
        flexShrink: 0,
      }}
    >
      {renderDigit()}
    </svg>
  );
}

export function SvgNeonColon({
  isAmber = false,
  width = 11,
  height = 79,
}: {
  isAmber?: boolean;
  width?: number;
  height?: number;
}) {
  const color = isAmber ? "#bef264" : "#000000";
  const glowShadow = isAmber
    ? "drop-shadow(0 0 7px rgba(190, 242, 100, 0.95)) drop-shadow(0 0 20px rgba(163, 230, 53, 0.55)) drop-shadow(0 0 40px rgba(132, 204, 22, 0.25))"
    : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.3))";

  return (
    <svg
      viewBox="0 0 9 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        color,
        filter: glowShadow,
        display: "block",
        flexShrink: 0,
      }}
    >
      <rect x="0" y="17" width="9" height="9" rx="2.5" fill="currentColor" />
      <rect x="0" y="41" width="9" height="9" rx="2.5" fill="currentColor" />
    </svg>
  );
}
