"use client";

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  /** adds class hooks the header uses for the DrawSVG intro */
  animated?: boolean;
  title?: string;
};

/**
 * Compact Reena shield, traced by hand from brand/reena-logo.jpg.
 * Registered trademark artwork — proportions must not be altered.
 */
export default function ShieldMark({
  size = 32,
  className = "",
  animated = false,
  title = "Reena",
}: Props) {
  const id = useId().replace(/:/g, "");
  const outer =
    "M12 30 L30 8 L90 8 L108 30 L108 68 C108 100 92 120 60 134 C28 120 12 100 12 68 Z";
  const mid =
    "M20 33.5 L33.5 16 L86.5 16 L100 33.5 L100 67 C100 95 86 112 60 124.5 C34 112 20 95 20 67 Z";
  const inner =
    "M27 36.5 L36.5 24 L83.5 24 L93 36.5 L93 66 C93 90 82 105 60 116 C38 105 27 90 27 66 Z";

  // "R" skeleton — stroked twice (white rail, red core) to recreate the outlined letterform
  const letters = [
    "M41 44 V 92",
    "M54 92 V 44",
    "M54 44 H 68 C 78 44 82 49 82 56.5 C 82 64 78 69 68 69 H 54",
    "M66 69 L 81 92",
  ];

  return (
    <svg
      viewBox="0 0 120 142"
      width={size}
      height={Math.round((size * 142) / 120)}
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={`${id}-nv`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#32519F" />
          <stop offset="1" stopColor="#223A7E" />
        </linearGradient>
      </defs>

      <path d={outer} fill={`url(#${id}-nv)`} />
      <path d={mid} fill="#FFFFFF" />
      <path d={inner} fill="#C8232B" />
      <path
        d={mid}
        stroke="#FFFFFF"
        strokeWidth="2"
        fill="none"
        className={animated ? "js-shield-keyline" : undefined}
      />

      <g
        stroke="#FFFFFF"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? "js-shield-letter" : undefined}
      >
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="#C8232B" strokeWidth="4.4" strokeLinecap="butt" strokeLinejoin="round">
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
