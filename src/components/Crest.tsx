"use client";

import { useId } from "react";

/**
 * Full Reena crest: shield + "WORLD CLASS" ribbon.
 * Used large (hero watermark, genuine check, CTA band). Do not alter proportions.
 */
export default function Crest({
  size = 160,
  className = "",
  muted = false,
}: {
  size?: number;
  className?: string;
  muted?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const blue = muted ? "currentColor" : "#29438E";
  const red = muted ? "currentColor" : "#C8232B";
  const white = muted ? "currentColor" : "#FFFFFF";

  const outer =
    "M12 30 L30 8 L90 8 L108 30 L108 68 C108 100 92 120 60 134 C28 120 12 100 12 68 Z";
  const mid =
    "M20 33.5 L33.5 16 L86.5 16 L100 33.5 L100 67 C100 95 86 112 60 124.5 C34 112 20 95 20 67 Z";
  const inner =
    "M27 36.5 L36.5 24 L83.5 24 L93 36.5 L93 66 C93 90 82 105 60 116 C38 105 27 90 27 66 Z";
  const letters = [
    "M41 44 V 92",
    "M54 92 V 44",
    "M54 44 H 68 C 78 44 82 49 82 56.5 C 82 64 78 69 68 69 H 54",
    "M66 69 L 81 92",
  ];

  const ribbonArc = "M 16 104 Q 60 134 104 104";

  return (
    <svg
      viewBox="-12 0 144 150"
      width={size}
      height={Math.round((size * 150) / 144)}
      className={className}
      fill="none"
      role="img"
      aria-label="Reena · World Class"
    >
      <title>Reena · World Class</title>
      <defs>
        <path id={`${id}-arc`} d="M 20 100 Q 60 132 100 100" />
        <linearGradient id={`${id}-nv`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={muted ? "currentColor" : "#32519F"} />
          <stop offset="1" stopColor={muted ? "currentColor" : "#223A7E"} />
        </linearGradient>
      </defs>

      {/* ribbon tails */}
      <g fill={blue}>
        <path d="M-10 88 L10 82 L20 104 L6 118 Z" />
        <path d="M130 88 L110 82 L100 104 L114 118 Z" />
      </g>
      {/* ribbon band */}
      <path
        d="M4 86 Q 60 134 116 86 L120 104 Q 60 152 0 104 Z"
        fill={blue}
      />
      <path d={ribbonArc} stroke={white} strokeWidth="1.4" fill="none" opacity="0.9" />

      {/* shield */}
      <path d={outer} fill={`url(#${id}-nv)`} />
      <path d={mid} fill={white} />
      <path d={inner} fill={red} />
      <g stroke={white} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke={red} strokeWidth="4.4" strokeLinecap="butt" strokeLinejoin="round">
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <text
        fill={white}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.22em",
        }}
      >
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
          WORLD CLASS
        </textPath>
      </text>
    </svg>
  );
}
