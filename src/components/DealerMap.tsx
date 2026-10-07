"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

/**
 * Simplified outline of Pakistan, plotted from real coordinates
 * (x = (lon − 60) × 22.2, y = (37.5 − lat) × 29) and then smoothed.
 * Decorative: no dealer cities are claimed — those come from the client
 * before the final site is built.
 */
const OUTLINE = [
  "M255 17", // Chitral, northern tip
  "L290 20 L322 14", // Wakhan corridor
  "L340 40 L377 58", // Karakoram, north-east
  "L355 80 L322 101", // down the Kashmir line
  "L330 122 L322 145", // Sialkot
  "L324 188", // the Punjab border below Lahore
  "L300 223 L264 281", // Cholistan into the Thar
  "L255 330 L240 382", // Rann of Kutch
  "L196 397", // Sir Creek
  "L155 368 L100 356 L51 359 L36 362", // the Makran coast west to Gwadar
  "L22 300 L18 223", // the Iran border
  "L40 220 L90 205 L144 188", // Chagai across to Chaman
  "L160 170 L206 165", // the Durand line
  "L196 130 L222 113", // the Kurram salient
  "L235 85 L255 58", // up past Chitral
  "Z",
].join(" ");

/** internal province divisions, drawn as lines rather than filled shapes */
const PROVINCES = [
  "M150 368 L158 330 L150 290 L172 256 L205 240", // Balochistan | Sindh
  "M205 240 L242 243 L266 272", // Sindh | Punjab
  "M206 165 L232 182 L242 212 L205 240", // KP | Punjab, along the Indus
  "M255 58 L292 76 L322 101", // Gilgit-Baltistan | KP
];

/** Ghotki, upper Sindh on the Indus (69.3 E, 28.0 N) */
const GHOTKI = { x: 206, y: 275 };

const ARCS = [
  { d: `M${GHOTKI.x} ${GHOTKI.y} C 240 230, 285 215, 306 196`, label: "Punjab" },
  { d: `M${GHOTKI.x} ${GHOTKI.y} C 196 225, 200 180, 214 148`, label: "North" },
  { d: `M${GHOTKI.x} ${GHOTKI.y} C 160 270, 110 300, 78 330`, label: "Balochistan" },
  { d: `M${GHOTKI.x} ${GHOTKI.y} C 200 320, 186 348, 178 372`, label: "Sindh" },
  { d: `M${GHOTKI.x} ${GHOTKI.y} C 250 220, 282 130, 300 72`, label: "Gilgit-Baltistan" },
];

export default function DealerMap({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) {
        gsap.set(".js-map-draw, .js-map-arc, .js-map-dot", { opacity: 1, strokeDashoffset: 0 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });

      gsap.utils.toArray<SVGPathElement>(".js-map-draw", root.current).forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });
      tl.to(".js-map-draw", {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.14,
        ease: "power2.inOut",
      });

      tl.fromTo(
        ".js-map-dot",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", transformOrigin: "center" },
        "-=0.5"
      );

      gsap.utils.toArray<SVGPathElement>(".js-map-arc", root.current).forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: `6 10`, strokeDashoffset: 0, opacity: 0 });
        tl.to(p, { opacity: 0.9, duration: 0.4 }, 1.2 + i * 0.16);
        gsap.to(p, {
          strokeDashoffset: -len,
          duration: 2.6 + i * 0.4,
          ease: "none",
          repeat: -1,
          delay: i * 0.3,
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className={`relative ${className}`}>
      <svg
        viewBox="0 0 420 420"
        className="w-full"
        role="img"
        aria-label="Illustration: Reena ships from Ghotki to dealers across Pakistan"
        fill="none"
      >
        <defs>
          <linearGradient id="map-arc-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#C8232B" />
            <stop offset="1" stopColor="#6E8BFF" />
          </linearGradient>
          <radialGradient id="map-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#6E8BFF" stopOpacity="0.22" />
            <stop offset="1" stopColor="#6E8BFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={GHOTKI.x} cy={GHOTKI.y} r="160" fill="url(#map-glow)" />

        {/* landmass fill, painted before the strokes draw in */}
        <path d={OUTLINE} fill="rgba(17,30,69,.55)" stroke="none" />

        {/* province divisions */}
        {PROVINCES.map((d, i) => (
          <path
            key={i}
            className="js-map-draw"
            d={d}
            stroke="#24376B"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0"
            fill="none"
          />
        ))}

        {/* national outline */}
        <path
          className="js-map-draw"
          d={OUTLINE}
          stroke="#3C5290"
          strokeWidth="2.2"
          strokeLinejoin="round"
          opacity="0"
          fill="none"
        />

        {/* arcs */}
        {ARCS.map((a, i) => (
          <path
            key={i}
            className="js-map-arc"
            d={a.d}
            stroke="url(#map-arc-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0"
          />
        ))}

        {/* Ghotki */}
        <g className="js-map-dot" style={{ opacity: 0 }}>
          {!prefersReduced() && (
            <circle cx={GHOTKI.x} cy={GHOTKI.y} r="7" fill="#C8232B" className="pulse-ring" />
          )}
          <circle cx={GHOTKI.x} cy={GHOTKI.y} r="7" fill="#C8232B" />
          <circle cx={GHOTKI.x} cy={GHOTKI.y} r="7" fill="none" stroke="#F2F5FF" strokeWidth="2" />
          <text
            x={GHOTKI.x + 16}
            y={GHOTKI.y + 5}
            fill="#F2F5FF"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 13,
              letterSpacing: "0.08em",
            }}
          >
            Reena · Ghotki
          </text>
        </g>
      </svg>

      {!compact && (
        <p className="mono-label mt-2 text-center text-[9.5px] text-steel/60">
          Dealer cities shown in the final website
        </p>
      )}
    </div>
  );
}
