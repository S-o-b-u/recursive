"use client";

import Link from "next/link";

export default function TrackBackButton() {
  const handleClick = () => {
    try {
      sessionStorage.setItem("recursive:skip-intro-for-anchor", "#themes");
      sessionStorage.setItem("recursive:intro:v1", "1");
    } catch {}
  };

  return (
    <Link
      href="/#themes"
      onClick={handleClick}
      className="tb-back-btn"
      aria-label="Back to all tracks"
      data-direction="back"
    >
      <svg
        viewBox="0 0 24 24"
        className="tb-back-icon"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>Back to all tracks</span>
    </Link>
  );
}
