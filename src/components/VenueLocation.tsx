"use client";

import React, { useState } from "react";
import { RevealBlock, RevealHeading } from "@/components/ui/reveal";
import Ornament from "@/components/ui/Ornament";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Train,
  Bus,
  Car,
  Map as MapIcon,
  Building2,
  Globe,
  Plus,
  Minus,
  Crosshair,
} from "lucide-react";

export default function VenueLocation() {
  const [copied, setCopied] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [zoom, setZoom] = useState(16);
  const [mapKey, setMapKey] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  const addressText =
    "157/ F, Nilgunj Road, Sahid Colony, Panihati, Sodepur, Kolkata, West Bengal 700114";
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Guru+Nanak+Institute+of+Technology+Panihati+Sodepur+Kolkata";
  const googleMapsEmbedUrl = isSatellite
    ? `https://maps.google.com/maps?q=22.6997,88.3792&hl=en&t=k&z=${zoom}&output=embed`
    : `https://maps.google.com/maps?q=22.6997,88.3792&hl=en&z=${zoom}&output=embed`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLocate = () => {
    setIsLocating(true);
    setZoom(16);
    setMapKey((k) => k + 1);
    setTimeout(() => setIsLocating(false), 600);
  };

  return (
    <section id="venue" className="venue-sec" aria-label="Hackathon Venue & Location">
      <div className="venue-container">
        {/* ── Section Header ── */}
        <div className="venue-head-block">
          <RevealBlock y={14}>
            <div className="venue-ornament-wrap">
              <Ornament className="venue-crown" />
            </div>
          </RevealBlock>

          <RevealBlock y={10}>
            <span className="venue-eyebrow">EVENT VENUE · IN-PERSON</span>
          </RevealBlock>

          <div className="venue-title-wrap">
            <RevealHeading
              className="venue-main-title"
              lines={["Guru Nanak Institute of Technology", "Sodepur, Kolkata"]}
            />
            <p className="venue-subtitle">
              Find us easily on the day of the hackathon. Use the interactive map for live navigation, transit routes, or copy the address below.
            </p>
          </div>
        </div>

        {/* ── 2-Column Grid Layout with Liquid Glass ── */}
        <div className="venue-grid-layout">
          {/* Left Column: Campus Address & Transit Cards */}
          <div className="venue-left-col">
            {/* 1. Campus Address Liquid Glass Card */}
            <div className="venue-glass-card">
              <span className="card-liquid-sheen" aria-hidden="true" />
              <div className="venue-address-header">
                <div className="venue-address-icon-box">
                  <MapPin className="w-5 h-5 text-[#1b4324]" />
                </div>
                <div className="venue-address-content">
                  <h3 className="venue-card-title">Campus Address</h3>
                  <p className="venue-address-lines">
                    157/ F, Nilgunj Road, Sahid Colony,<br />
                    Panihati, Sodepur, Kolkata,<br />
                    West Bengal 700114
                  </p>
                </div>
              </div>

              {/* Action Buttons in Liquid Glass */}
              <div className="venue-btn-row">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-get-directions"
                >
                  <Navigation className="w-4 h-4 -rotate-45" />
                  <span>Get Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-copy-address"
                  aria-label="Copy Address"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#111a14]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Transit & Getting Here Liquid Glass Card */}
            <div className="venue-glass-card">
              <span className="card-liquid-sheen" aria-hidden="true" />
              <h3 className="venue-card-title transit-title">Transit &amp; Getting Here</h3>
              <div className="transit-items-stack">
                {/* By Train */}
                <div className="transit-row">
                  <div className="transit-icon-box">
                    <Train className="w-5 h-5 text-[#1b4324]" />
                  </div>
                  <div className="transit-text-wrap">
                    <span className="transit-label">By Train</span>
                    <p className="transit-desc">
                      Sodepur Station (Sealdah North Line) is ~1.2 km away (5 mins by auto or e-rickshaw).
                    </p>
                  </div>
                </div>

                {/* By Bus */}
                <div className="transit-row">
                  <div className="transit-icon-box">
                    <Bus className="w-5 h-5 text-[#1b4324]" />
                  </div>
                  <div className="transit-text-wrap">
                    <span className="transit-label">By Bus</span>
                    <p className="transit-desc">
                      Frequent buses via BT Road to Sodepur crossing or directly along Nilgunj Road.
                    </p>
                  </div>
                </div>

                {/* Cabs / Parking */}
                <div className="transit-row">
                  <div className="transit-icon-box">
                    <Car className="w-5 h-5 text-[#1b4324]" />
                  </div>
                  <div className="transit-text-wrap">
                    <span className="transit-label">Cabs / Parking</span>
                    <p className="transit-desc">
                      Drop-off right at GNIT Main Gate with designated event parking on campus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Map in Liquid Glass */}
          <div className="venue-right-col">
            <div className="venue-map-card">
              <span className="card-liquid-sheen" aria-hidden="true" />

              <div className="map-view-frame">
                {/* Floating Top Header Badges */}
                <div className="map-floating-top">
                  <div className="map-float-pill">
                    <MapIcon className="w-4 h-4 text-[#1b4324]" />
                    <span>Live Navigation</span>
                  </div>

                  <div className="map-float-pill">
                    <Building2 className="w-4 h-4 text-[#1b4324]" />
                    <span>GNIT Campus</span>
                  </div>
                </div>

                {/* Google Maps Interactive Iframe */}
                <iframe
                  key={`${mapKey}-${isSatellite}-${zoom}`}
                  title="Guru Nanak Institute of Technology Location Map"
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  className="google-maps-frame"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Floating Location Card Overlay */}
                <div className="map-pin-callout">
                  <div className="pin-icon-wrap">
                    <MapPin className="w-5 h-5 text-[#1b4324] fill-[#1b4324]" />
                  </div>
                  <div className="pin-text-wrap">
                    <div className="pin-name">Guru Nanak Institute of Technology</div>
                    <div className="pin-sub">GNIT Sodepur, Kolkata</div>
                  </div>
                </div>

                {/* Floating Map Zoom & Reset Controls */}
                <div className="map-floating-controls">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(z + 1, 20))}
                    className="map-control-btn"
                    aria-label="Zoom In"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4 text-[#111a14]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(z - 1, 11))}
                    className="map-control-btn"
                    aria-label="Zoom Out"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4 text-[#111a14]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleLocate}
                    className={`map-control-btn ${isLocating ? "locating" : ""}`}
                    aria-label="Center Map on GNIT Campus"
                    title="Center Map on GNIT Campus"
                  >
                    <Crosshair
                      className={`w-4 h-4 ${
                        isLocating ? "animate-spin text-emerald-700" : "text-[#111a14]"
                      }`}
                    />
                  </button>
                </div>

                {/* Floating Bottom Info Bar in Liquid Glass */}
                <div className="map-floating-bottom">
                  <div className="map-bottom-left">
                    <div className="map-coords-info">
                      <div className="coords-line font-mono">22.6907° N, 88.3792° E</div>
                      <div className="city-line">Sodepur, Kolkata</div>
                    </div>
                  </div>

                  <div className="map-bottom-actions">
                    <button
                      type="button"
                      onClick={() => setIsSatellite(!isSatellite)}
                      className={`btn-satellite-toggle ${isSatellite ? "active" : ""}`}
                      aria-label="Toggle Satellite Imagery"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="btn-label-desktop">{isSatellite ? "Roadmap" : "Satellite Imagery"}</span>
                      <span className="btn-label-mobile">{isSatellite ? "Roadmap" : "Satellite"}</span>
                    </button>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-gmaps"
                    >
                      <span className="btn-label-desktop">Open in Google Maps</span>
                      <span className="btn-label-mobile">Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#55655a]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style href="venue-transparent-liquid-styles" precedence="default">{`
        .venue-sec {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          padding-block: clamp(3.5rem, 20px + 4.5vw, 6rem);
          padding-inline: clamp(1rem, 3.5vw, 2.5rem);
          scroll-margin-top: 7rem;
        }

        .venue-container {
          position: relative;
          width: 100%;
          max-width: 76rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Header ── */
        .venue-head-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: clamp(2rem, 3vw, 3.25rem);
        }

        .venue-ornament-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: clamp(1rem, 1.5vh, 1.35rem);
        }

        .venue-crown {
          width: clamp(114px, 56.87px + 15.87vw, 260px);
          height: auto;
          opacity: 0.88;
        }

        .venue-eyebrow {
          display: inline-block;
          font-family: var(--font-label), var(--font-geist-mono), monospace;
          font-size: 0.775rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3b6b3e;
          margin-bottom: 0.85rem;
        }

        .venue-title-wrap {
          text-align: center;
          max-width: 48rem;
          margin-inline: auto;
        }

        .venue-main-title {
          font-family: var(--font-heading), var(--font-dm-sans), sans-serif;
          font-size: clamp(2.1rem, 16px + 2.8vw, 3.4rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #111c14;
          margin: 0;
        }

        .venue-subtitle {
          margin-top: 1rem;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: clamp(0.925rem, 13px + 0.25vw, 1.05rem);
          color: #55655a;
          line-height: 1.55;
          max-width: 42rem;
          margin-inline: auto;
        }

        /* ── Grid Layout ── */
        .venue-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          align-items: stretch;
        }

        @media (min-width: 980px) {
          .venue-grid-layout {
            grid-template-columns: 0.88fr 1.32fr;
          }
        }

        /* ── Left Column ── */
        .venue-left-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Transparent Liquid Glass Card ── */
        .venue-glass-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;

          background:
            radial-gradient(130% 90% at 12% 10%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.45) 36%, transparent 68%),
            radial-gradient(100% 80% at 88% 90%, rgba(215, 245, 210, 0.35) 0%, transparent 60%),
            linear-gradient(152deg, rgba(255, 255, 255, 0.85) 0%, rgba(246, 252, 246, 0.68) 48%, rgba(235, 248, 238, 0.58) 100%);
          backdrop-filter: blur(28px) saturate(180%) contrast(104%);
          -webkit-backdrop-filter: blur(28px) saturate(180%) contrast(104%);
          border: 1.5px solid rgba(255, 255, 255, 0.88);
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 1),
            inset 0 -1.5px 3px rgba(22, 36, 26, 0.05),
            inset 0 0 28px rgba(255, 255, 255, 0.4),
            0 20px 48px -15px rgba(18, 38, 22, 0.14),
            0 6px 16px -4px rgba(18, 38, 22, 0.06);
          border-radius: 1.6rem;
          padding: 1.65rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease;
        }

        .venue-glass-card:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 1),
            0 24px 56px -16px rgba(18, 38, 22, 0.2);
        }

        .card-liquid-sheen {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0) 24%,
            rgba(255, 255, 255, 0.7) 46%,
            rgba(220, 248, 215, 0.28) 52%,
            rgba(255, 255, 255, 0.65) 58%,
            rgba(255, 255, 255, 0) 78%
          );
          opacity: 0.65;
        }

        .venue-address-header {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 1.15rem;
          align-items: flex-start;
        }

        .venue-address-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 1.1rem;
          background: rgba(238, 248, 238, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 2px 8px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .venue-address-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }

        .venue-card-title {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #111c14;
          margin: 0 0 0.45rem 0;
          letter-spacing: -0.015em;
        }

        .venue-address-lines {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.92rem;
          line-height: 1.5;
          color: #55655a;
          margin: 0;
        }

        .venue-btn-row {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-get-directions {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #142e1c;
          color: #ffffff;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.72rem 1.15rem;
          border-radius: 0.85rem;
          text-decoration: none;
          flex: 1;
          transition: background 180ms ease, transform 150ms ease, box-shadow 180ms ease;
          box-shadow: 0 4px 14px rgba(20, 46, 28, 0.26);
        }

        .btn-get-directions:hover {
          background: #1f4229;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(20, 46, 28, 0.32);
        }

        .btn-copy-address {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #111c14;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.72rem 1.15rem;
          border-radius: 0.85rem;
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 2px 6px rgba(0, 0, 0, 0.04);
          cursor: pointer;
          flex: 1;
          transition: background 180ms ease, border-color 180ms ease;
        }

        .btn-copy-address:hover {
          background: #ffffff;
        }

        /* ── Transit Card ── */
        .transit-title {
          position: relative;
          z-index: 1;
          margin-bottom: 1.15rem;
        }

        .transit-items-stack {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .transit-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .transit-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 0.85rem;
          background: rgba(238, 248, 238, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 2px 6px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .transit-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .transit-label {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.925rem;
          font-weight: 700;
          color: #111c14;
          margin-bottom: 0.15rem;
        }

        .transit-desc {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.85rem;
          line-height: 1.45;
          color: #55655a;
          margin: 0;
        }

        /* ── Right Column: Google Maps Liquid Glass Card ── */
        .venue-right-col {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }

        .venue-map-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;

          background:
            radial-gradient(130% 90% at 15% 8%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.5) 34%, transparent 68%),
            radial-gradient(100% 80% at 88% 92%, rgba(215, 245, 210, 0.38) 0%, transparent 60%),
            linear-gradient(155deg, rgba(255, 255, 255, 0.88) 0%, rgba(246, 252, 246, 0.72) 48%, rgba(235, 248, 238, 0.62) 100%);
          backdrop-filter: blur(32px) saturate(185%) contrast(104%);
          -webkit-backdrop-filter: blur(32px) saturate(185%) contrast(104%);
          border: 1.5px solid rgba(255, 255, 255, 0.88);
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 1),
            inset 0 -1.5px 3px rgba(22, 36, 26, 0.05),
            inset 0 0 30px rgba(255, 255, 255, 0.4),
            0 20px 48px -15px rgba(18, 38, 22, 0.16),
            0 6px 16px -4px rgba(18, 38, 22, 0.06);
          border-radius: 1.6rem;
          padding: 0.85rem;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease;
        }

        .venue-map-card:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1.5px 3px rgba(255, 255, 255, 1),
            0 26px 60px -16px rgba(18, 38, 22, 0.22);
        }

        .map-view-frame {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          min-height: 480px;
          border-radius: 1.25rem;
          overflow: hidden;
          background: #eaf1e9;
        }

        .google-maps-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: calc(100% + 110px);
          border: 0;
          display: block;
        }

        /* Floating Top Bar with Liquid Glass */
        .map-floating-top {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          pointer-events: none;
        }

        .map-float-pill {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 4px 14px rgba(0, 0, 0, 0.06);
          border-radius: 0.75rem;
          padding: 0.42rem 0.95rem;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #111c14;
        }

        /* Floating Pin Callout Tooltip */
        .map-pin-callout {
          position: absolute;
          top: 42%;
          left: 54%;
          transform: translate(-50%, -50%);
          z-index: 9;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 6px 20px rgba(0, 0, 0, 0.1);
          border-radius: 0.85rem;
          padding: 0.5rem 0.85rem;
          pointer-events: none;
        }

        .pin-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .pin-name {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.825rem;
          font-weight: 700;
          color: #111c14;
          line-height: 1.25;
        }

        .pin-sub {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 1px;
        }

        /* Floating Zoom & Controls with Liquid Glass */
        .map-floating-controls {
          position: absolute;
          right: 1rem;
          bottom: 5.5rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .map-control-btn {
          width: 34px;
          height: 34px;
          border-radius: 0.65rem;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 150ms ease, transform 150ms ease, border-color 150ms ease;
        }

        .map-control-btn:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .map-control-btn.locating {
          background: rgba(238, 248, 238, 0.95);
          border-color: #a7d3a7;
        }

        /* Floating Bottom Bar with Liquid Glass */
        .map-floating-bottom {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px) saturate(170%);
          -webkit-backdrop-filter: blur(20px) saturate(170%);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 6px 20px rgba(0, 0, 0, 0.08);
          border-radius: 1rem;
          padding: 0.65rem 0.95rem;
          flex-wrap: wrap;
        }

        .map-bottom-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .map-coords-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .coords-line {
          font-size: 0.825rem;
          font-weight: 700;
          color: #111c14;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .city-line {
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 1px;
          white-space: nowrap;
        }

        .map-bottom-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: nowrap;
          flex-shrink: 0;
        }

        .btn-satellite-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 1px 3px rgba(0, 0, 0, 0.04);
          border-radius: 0.75rem;
          padding: 0.45rem 0.85rem;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.825rem;
          font-weight: 600;
          color: #111c14;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
        }

        .btn-satellite-toggle:hover {
          background: #ffffff;
        }

        .btn-satellite-toggle.active {
          background: #142e1c;
          border-color: #142e1c;
          color: #ffffff;
        }

        .btn-open-gmaps {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 1),
            0 1px 3px rgba(0, 0, 0, 0.04);
          border-radius: 0.75rem;
          padding: 0.45rem 0.95rem;
          font-family: var(--font-body), var(--font-dm-sans), sans-serif;
          font-size: 0.825rem;
          font-weight: 600;
          color: #111c14;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 150ms ease, border-color 150ms ease;
        }

        .btn-label-desktop {
          display: inline;
        }

        .btn-label-mobile {
          display: none;
        }

        .btn-open-gmaps:hover {
          background: #ffffff;
        }

        @media (max-width: 640px) {
          .map-floating-top {
            top: 0.65rem;
            left: 0.65rem;
            right: 0.65rem;
          }

          .map-float-pill {
            padding: 0.3rem 0.55rem;
            font-size: 0.72rem;
            gap: 0.35rem;
            border-radius: 0.6rem;
          }

          .map-float-pill svg {
            width: 13px;
            height: 13px;
          }

          .map-pin-callout {
            padding: 0.35rem 0.6rem;
            top: 38%;
            left: 50%;
            border-radius: 0.7rem;
          }

          .pin-name {
            font-size: 0.72rem;
          }

          .pin-sub {
            font-size: 0.62rem;
          }

          .map-floating-controls {
            right: 0.65rem;
            bottom: 4.35rem;
            gap: 0.35rem;
          }

          .map-control-btn {
            width: 28px;
            height: 28px;
            border-radius: 0.55rem;
          }

          .map-control-btn svg {
            width: 13px;
            height: 13px;
          }

          .map-floating-bottom {
            bottom: 0.65rem;
            left: 0.65rem;
            right: 0.65rem;
            padding: 0.38rem 0.55rem;
            gap: 0.4rem;
            flex-wrap: nowrap;
            border-radius: 0.85rem;
          }

          .coords-line {
            font-size: 0.68rem;
          }

          .city-line {
            font-size: 0.62rem;
          }

          .map-bottom-actions {
            flex-wrap: nowrap;
            gap: 0.28rem;
          }

          .btn-label-desktop {
            display: none;
          }

          .btn-label-mobile {
            display: inline;
          }

          .btn-satellite-toggle,
          .btn-open-gmaps {
            padding: 0.28rem 0.48rem;
            font-size: 0.71rem;
            gap: 0.25rem;
            border-radius: 0.55rem;
            white-space: nowrap;
          }

          .btn-satellite-toggle svg,
          .btn-open-gmaps svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </section>
  );
}
