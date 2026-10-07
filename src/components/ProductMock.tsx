"use client";

import { useEffect, useId, useRef, useState } from "react";

export type MockVariant = "stabilizer" | "inverter" | "mppt" | "coil";

type Props = {
  variant: MockVariant;
  model?: string;
  className?: string;
  /** -1..1, drives the layered 3D tilt */
  tilt?: number;
  /** split body / face / display onto separate Z planes */
  layered?: boolean;
  highlightSerial?: boolean;
  live?: boolean;
};

function useTicker(live: boolean, values: string[], ms = 1500) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!live) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % values.length), ms);
    return () => clearInterval(id);
  }, [live, values.length, ms]);
  return values[i];
}

/* ── shared defs ─────────────────────────────────────────────── */
function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8E97AA" />
        <stop offset="0.07" stopColor="#D9DEE8" />
        <stop offset="0.3" stopColor="#EFF2F8" />
        <stop offset="0.52" stopColor="#C3CAD8" />
        <stop offset="0.78" stopColor="#E6EAF2" />
        <stop offset="0.94" stopColor="#A6AEBF" />
        <stop offset="1" stopColor="#848EA2" />
      </linearGradient>
      <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.1" />
        <stop offset="1" stopColor="#5C6478" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#1A2238" />
        <stop offset="0.5" stopColor="#070B16" />
        <stop offset="1" stopColor="#0E1526" />
      </linearGradient>
      <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#16244E" />
        <stop offset="0.12" stopColor="#2A3C70" />
        <stop offset="0.5" stopColor="#1C2C5C" />
        <stop offset="0.88" stopColor="#2A3C70" />
        <stop offset="1" stopColor="#101C3E" />
      </linearGradient>
      <linearGradient id={`${id}-white`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#D8DDE8" />
        <stop offset="0.1" stopColor="#FAFBFE" />
        <stop offset="0.6" stopColor="#F0F3F9" />
        <stop offset="1" stopColor="#CDD3E0" />
      </linearGradient>
      <radialGradient id={`${id}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#030713" stopOpacity="0.55" />
        <stop offset="1" stopColor="#030713" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id={`${id}-noise`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <pattern id={`${id}-vent`} width="100%" height="9" patternUnits="userSpaceOnUse">
        <rect width="100%" height="4" rx="2" fill="#000" opacity="0.2" />
        <rect y="1" width="100%" height="1.2" rx="0.6" fill="#fff" opacity="0.28" />
      </pattern>
    </defs>
  );
}

function SegmentDisplay({
  id,
  x,
  y,
  w,
  h,
  value,
  unit = "V",
  sub,
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h * 0.14} fill={`url(#${id}-glass)`} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h * 0.14}
        fill="none"
        stroke="#0A0F1E"
        strokeWidth="1.5"
      />
      <rect
        x={x + 2}
        y={y + 2}
        width={w - 4}
        height={h * 0.34}
        rx={h * 0.1}
        fill="#FFFFFF"
        opacity="0.05"
      />
      {/* ghost segments */}
      <text
        x={x + w / 2}
        y={y + h * 0.66}
        textAnchor="middle"
        fill="#6E8BFF"
        opacity="0.09"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: h * 0.52, fontWeight: 700 }}
      >
        888
      </text>
      <text
        x={x + w / 2}
        y={y + h * 0.66}
        textAnchor="middle"
        fill="#6E8BFF"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: h * 0.52,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </text>
      <text
        x={x + w - 8}
        y={y + h * 0.9}
        textAnchor="end"
        fill="#6E8BFF"
        opacity="0.75"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: h * 0.17 }}
      >
        {unit}
      </text>
      {sub && (
        <text
          x={x + 8}
          y={y + h * 0.9}
          fill="#6E8BFF"
          opacity="0.55"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: h * 0.15,
            letterSpacing: "0.12em",
          }}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/* ── stabilizer (3:4) ────────────────────────────────────────── */
function Stabilizer({
  id,
  model,
  live,
  highlightSerial,
}: {
  id: string;
  model: string;
  live: boolean;
  highlightSerial: boolean;
}) {
  const v = useTicker(live, ["220", "219", "221", "220", "218"], 1500);
  return (
    <>
      <ellipse cx="150" cy="378" rx="120" ry="18" fill={`url(#${id}-shadow)`} />
      <g data-layer="body">
        <rect x="34" y="26" width="232" height="336" rx="26" fill={`url(#${id}-steel)`} />
        <rect
          x="34"
          y="26"
          width="232"
          height="336"
          rx="26"
          fill={`url(#${id}-bevel)`}
          opacity="0.5"
        />
        <rect
          x="34"
          y="26"
          width="232"
          height="336"
          rx="26"
          fill="none"
          stroke="#7C879C"
          strokeWidth="1.2"
        />
        <rect
          x="34"
          y="26"
          width="232"
          height="336"
          rx="26"
          filter={`url(#${id}-noise)`}
          opacity="0.04"
        />
        {/* top bevel highlight */}
        <path
          d="M46 30 H254 A14 14 0 0 1 266 44"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity="0.85"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <g data-layer="face">
        {/* inset face plate */}
        <rect
          x="48"
          y="40"
          width="204"
          height="308"
          rx="18"
          fill="#FFFFFF"
          opacity="0.14"
        />
        <rect
          x="48"
          y="40"
          width="204"
          height="308"
          rx="18"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* shield */}
        <g transform="translate(132 58) scale(0.3)">
          <ShieldMarkInline />
        </g>
        <text
          x="150"
          y="108"
          textAnchor="middle"
          fill="#2A3144"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: "0.22em",
          }}
        >
          REENA
        </text>
        <text
          x="150"
          y="122"
          textAnchor="middle"
          fill="#8A93A6"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 7.5,
            letterSpacing: "0.3em",
          }}
        >
          WORLD CLASS
        </text>
      </g>

      <g data-layer="display">
        <SegmentDisplay
          id={id}
          x={70}
          y={136}
          w={160}
          h={74}
          value={v}
          unit="V"
          sub="OUT"
        />
      </g>

      <g data-layer="face">
        {/* LEDs */}
        <g transform="translate(93 232)">
          {[
            ["#2BD07A", 1],
            ["#FFB020", 0.16],
            ["#E2343C", 0.16],
          ].map(([c, o], i) => (
            <g key={i} transform={`translate(${i * 57} 0)`}>
              {o === 1 && <circle r="11" fill={c as string} opacity="0.22" />}
              <circle r="5.5" fill={c as string} opacity={o as number} />
              <circle r="5.5" fill="none" stroke="#6D7689" strokeWidth="1" opacity="0.6" />
              <circle cx="-1.6" cy="-1.6" r="1.6" fill="#fff" opacity={o === 1 ? 0.8 : 0.25} />
            </g>
          ))}
        </g>
        <g
          fill="#8A93A6"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 6.5, letterSpacing: "0.16em" }}
        >
          <text x="93" y="254" textAnchor="middle">NORMAL</text>
          <text x="150" y="254" textAnchor="middle">DELAY</text>
          <text x="207" y="254" textAnchor="middle">FAULT</text>
        </g>

        {/* model plate */}
        <rect x="100" y="266" width="100" height="20" rx="5" fill="#2A3144" opacity="0.08" />
        <text
          x="150"
          y="280"
          textAnchor="middle"
          fill="#4A5573"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
          }}
        >
          {model}
        </text>

        {/* vents */}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect
                x="86"
                y={300 + i * 10}
                width="128"
                height="4"
                rx="2"
                fill="#5C6478"
                opacity="0.26"
              />
              <rect
                x="86"
                y={301 + i * 10}
                width="128"
                height="1.1"
                rx="0.6"
                fill="#FFFFFF"
                opacity="0.55"
              />
            </g>
          ))}
        </g>

        {highlightSerial && (
          <g>
            <rect
              x="190"
              y="312"
              width="62"
              height="26"
              rx="4"
              fill="#FFFFFF"
              stroke="#C8232B"
              strokeWidth="2"
            />
            <text
              x="221"
              y="323"
              textAnchor="middle"
              fill="#4A5573"
              style={{ fontFamily: "var(--font-mono), monospace", fontSize: 5.5, letterSpacing: "0.1em" }}
            >
              SERIAL NO.
            </text>
            <text
              x="221"
              y="333"
              textAnchor="middle"
              fill="#0B1124"
              style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, fontWeight: 700 }}
            >
              RN-26-005812
            </text>
          </g>
        )}
      </g>
    </>
  );
}

/* ── inverter (2:3) ──────────────────────────────────────────── */
function Inverter({ id, model, live }: { id: string; model: string; live: boolean }) {
  const bars = useTicker(live, ["4", "3", "4", "5"], 1800);
  return (
    <>
      <ellipse cx="150" cy="432" rx="110" ry="16" fill={`url(#${id}-shadow)`} />
      <g data-layer="body">
        <rect x="40" y="24" width="220" height="396" rx="22" fill={`url(#${id}-white)`} />
        <rect
          x="40"
          y="24"
          width="220"
          height="396"
          rx="22"
          fill="none"
          stroke="#B9C0CE"
          strokeWidth="1.2"
        />
        <path d="M40 46 v352" stroke="#29438E" strokeWidth="0" />
        {/* navy side band */}
        <path
          d="M40 300 h220 v98 a22 22 0 0 1 -22 22 H62 a22 22 0 0 1 -22 -22 Z"
          fill={`url(#${id}-navy)`}
        />
        <rect x="40" y="300" width="220" height="2" fill="#0B1124" opacity="0.2" />
        <path
          d="M52 28 H248 A14 14 0 0 1 260 40"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity="0.9"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      <g data-layer="face">
        <g transform="translate(132 46) scale(0.3)">
          <ShieldMarkInline />
        </g>
        <text
          x="150"
          y="96"
          textAnchor="middle"
          fill="#2A3144"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.22em",
          }}
        >
          REENA
        </text>
      </g>

      <g data-layer="display">
        <rect x="64" y="118" width="172" height="118" rx="10" fill={`url(#${id}-glass)`} />
        <rect
          x="64"
          y="118"
          width="172"
          height="118"
          rx="10"
          fill="none"
          stroke="#0A0F1E"
          strokeWidth="1.5"
        />
        {/* sun icon */}
        <g stroke="#6E8BFF" strokeWidth="1.6" fill="none" transform="translate(84 140)">
          <circle cx="8" cy="8" r="4.5" />
          <path d="M8 0v2.6M8 13.4V16M0 8h2.6M13.4 8H16M2.3 2.3l1.9 1.9M11.8 11.8l1.9 1.9M13.7 2.3l-1.9 1.9M4.2 11.8l-1.9 1.9" />
        </g>
        <text
          x="112"
          y="154"
          fill="#6E8BFF"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 14, fontWeight: 700 }}
        >
          PV 3.6kW
        </text>
        {/* battery */}
        <g transform="translate(84 172)">
          <rect width="46" height="20" rx="3" fill="none" stroke="#6E8BFF" strokeWidth="1.6" />
          <rect x="47" y="6" width="3.5" height="8" rx="1.5" fill="#6E8BFF" />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={3 + i * 10.5}
              y="3"
              width="8"
              height="14"
              rx="1.5"
              fill="#2BD07A"
              opacity={i < Number(bars) ? 0.95 : 0.12}
            />
          ))}
        </g>
        <text
          x="146"
          y="187"
          fill="#6E8BFF"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13 }}
        >
          48V · 92%
        </text>
        <text
          x="84"
          y="218"
          fill="#6E8BFF"
          opacity="0.6"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.18em" }}
        >
          LOAD 1240 W · AC OUT 230 V
        </text>
      </g>

      <g data-layer="face">
        <rect x="88" y="252" width="124" height="22" rx="5" fill="#2A3144" opacity="0.08" />
        <text
          x="150"
          y="267"
          textAnchor="middle"
          fill="#4A5573"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: "0.12em" }}
        >
          {model}
        </text>
        {/* buttons */}
        <g transform="translate(96 288)">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 36} 0)`}>
              <circle r="10" fill="#E3E7EF" stroke="#B9C0CE" strokeWidth="1" />
              <circle r="10" cy="-1" fill="#FFFFFF" opacity="0.5" />
            </g>
          ))}
        </g>
        {/* terminals on navy band */}
        <g transform="translate(70 332)">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 40} 0)`}>
              <rect width="28" height="30" rx="4" fill="#0A1330" opacity="0.6" />
              <circle cx="14" cy="15" r="7" fill="#1A2A5C" stroke="#3A4C82" strokeWidth="1" />
              <path d="M10 15h8" stroke="#8B9BC8" strokeWidth="1.6" />
            </g>
          ))}
        </g>
        <text
          x="150"
          y="396"
          textAnchor="middle"
          fill="#8BA0D8"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7.5, letterSpacing: "0.26em" }}
        >
          PV + / PV − / BAT / AC IN / AC OUT
        </text>
      </g>
    </>
  );
}

/* ── MPPT charger (4:3) ──────────────────────────────────────── */
function Mppt({ id, model, live }: { id: string; model: string; live: boolean }) {
  const a = useTicker(live, ["58", "60", "59", "61"], 1600);
  return (
    <>
      <ellipse cx="200" cy="268" rx="140" ry="16" fill={`url(#${id}-shadow)`} />
      {/* heat-sink fins */}
      <g data-layer="body">
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i}>
            <rect
              x={54 + i * 21}
              y="18"
              width="13"
              height="36"
              rx="3"
              fill={`url(#${id}-navy)`}
            />
            <rect
              x={54 + i * 21}
              y="18"
              width="13"
              height="4"
              rx="2"
              fill="#5C7ACB"
              opacity="0.45"
            />
          </g>
        ))}
        <rect x="46" y="48" width="308" height="192" rx="18" fill={`url(#${id}-navy)`} />
        <rect
          x="46"
          y="48"
          width="308"
          height="192"
          rx="18"
          fill="none"
          stroke="#0A1330"
          strokeWidth="1.5"
        />
        <path
          d="M58 52 H342 A12 12 0 0 1 354 64"
          stroke="#9FB4EC"
          strokeWidth="2"
          opacity="0.55"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="46"
          y="48"
          width="308"
          height="192"
          rx="18"
          filter={`url(#${id}-noise)`}
          opacity="0.05"
        />
      </g>

      <g data-layer="face">
        <g transform="translate(62 62) scale(0.26)">
          <ShieldMarkInline />
        </g>
        <text
          x="94"
          y="84"
          fill="#F2F5FF"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.2em",
          }}
        >
          REENA
        </text>
        <text
          x="94"
          y="98"
          fill="#8BA0D8"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 8, letterSpacing: "0.2em" }}
        >
          MPPT SOLAR CHARGE CONTROLLER
        </text>
      </g>

      <g data-layer="display">
        <SegmentDisplay id={id} x={212} y={62} w={126} h={60} value={a} unit="A" sub="PV→BAT" />
      </g>

      <g data-layer="face">
        <rect x="62" y="118" width="128" height="20" rx="5" fill="#0A1330" opacity="0.5" />
        <text
          x="72"
          y="132"
          fill="#9FB4EC"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.12em" }}
        >
          {model} · 24V AUTO
        </text>
        {/* LEDs */}
        <g transform="translate(74 158)">
          {[
            ["#2BD07A", 1],
            ["#6E8BFF", 1],
            ["#FFB020", 0.18],
          ].map(([c, o], i) => (
            <g key={i} transform={`translate(${i * 30} 0)`}>
              <circle r="8" fill={c as string} opacity={(o as number) * 0.25} />
              <circle r="4" fill={c as string} opacity={o as number} />
            </g>
          ))}
        </g>
        <g
          fill="#8BA0D8"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, letterSpacing: "0.14em" }}
        >
          <text x="74" y="180" textAnchor="middle">CHG</text>
          <text x="104" y="180" textAnchor="middle">PV</text>
          <text x="134" y="180" textAnchor="middle">ERR</text>
        </g>
        {/* buttons */}
        <g transform="translate(212 150)">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 34} 0)`}>
              <rect x="-12" y="-10" width="24" height="20" rx="5" fill="#0D1838" stroke="#3A4C82" strokeWidth="1" />
              <rect x="-12" y="-10" width="24" height="8" rx="4" fill="#FFFFFF" opacity="0.07" />
            </g>
          ))}
        </g>
        {/* terminals */}
        <g transform="translate(74 196)">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 68} 0)`}>
              <rect width="52" height="32" rx="5" fill="#070D20" />
              <circle cx="26" cy="16" r="9" fill="#16244E" stroke="#3A4C82" strokeWidth="1.2" />
              <path d="M21 16h10M26 11v10" stroke="#8B9BC8" strokeWidth="1.6" />
            </g>
          ))}
        </g>
      </g>
    </>
  );
}

/* ── wire coil ───────────────────────────────────────────────── */
function Coil({ id, model }: { id: string; model: string }) {
  const rings = [
    { r: 128, c: "#C8232B" },
    { r: 112, c: "#1A1F2E" },
    { r: 96, c: "#E0A32B" },
    { r: 80, c: "#29438E" },
    { r: 64, c: "#2BD07A" },
  ];
  return (
    <>
      <ellipse cx="200" cy="356" rx="140" ry="18" fill={`url(#${id}-shadow)`} />
      <g data-layer="body" transform="translate(200 190)">
        {rings.map((ring, i) => (
          <g key={i}>
            <circle r={ring.r} fill="none" stroke={ring.c} strokeWidth="13" />
            <circle
              r={ring.r}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              opacity="0.3"
              strokeDasharray="1 7"
            />
            <circle
              r={ring.r - 4.5}
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              opacity="0.22"
            />
          </g>
        ))}
        {/* copper core peeking out */}
        <g transform="rotate(-24)">
          <path
            d="M128 0 L186 0"
            stroke="#C8232B"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path d="M178 0 L196 0" stroke="#C97B32" strokeWidth="7" strokeLinecap="round" />
          <path d="M186 0 L200 0" stroke="#E9A860" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <g data-layer="face" transform="translate(200 190)">
        <circle r="46" fill="#FFFFFF" opacity="0.96" />
        <circle r="46" fill="none" stroke="#E1E6F0" strokeWidth="1.5" />
        <g transform="translate(-13 -30) scale(0.21)">
          <ShieldMarkInline />
        </g>
        <text
          y="12"
          textAnchor="middle"
          fill="#0B1124"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
          }}
        >
          REENA
        </text>
        <text
          y="26"
          textAnchor="middle"
          fill="#4A5573"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.08em" }}
        >
          {model}
        </text>
        <text
          y="38"
          textAnchor="middle"
          fill="#8A93A6"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 7, letterSpacing: "0.16em" }}
        >
          90 M COIL
        </text>
      </g>
    </>
  );
}

/** inline copy of the shield so it can live inside another <svg> */
function ShieldMarkInline() {
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
  return (
    <g>
      <path d={outer} fill="#29438E" />
      <path d={mid} fill="#FFFFFF" />
      <path d={inner} fill="#C8232B" />
      <g stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="#C8232B" strokeWidth="4.4" strokeLinecap="butt" fill="none">
        {letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </g>
  );
}

const BOX: Record<MockVariant, string> = {
  stabilizer: "0 0 300 400",
  inverter: "0 0 300 450",
  mppt: "0 0 400 290",
  coil: "0 0 400 380",
};

export default function ProductMock({
  variant,
  model = "RS-5000",
  className = "",
  tilt = 0,
  layered = false,
  highlightSerial = false,
  live = true,
}: Props) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!layered || !ref.current) return;
    const g = ref.current.querySelectorAll<SVGGElement>("[data-layer]");
    g.forEach((el) => {
      const layer = el.dataset.layer;
      const z = layer === "display" ? 26 : layer === "face" ? 14 : 0;
      el.style.transform = `translateZ(${z}px)`;
    });
  }, [layered]);

  return (
    <svg
      ref={ref}
      viewBox={BOX[variant]}
      className={className}
      role="img"
      aria-label={`Illustration of the Reena ${model}`}
      style={
        layered
          ? {
              transformStyle: "preserve-3d",
              transform: `perspective(1400px) rotateY(${tilt * 14}deg) rotateX(${
                -tilt * 3
              }deg)`,
            }
          : undefined
      }
    >
      <Defs id={id} />
      {variant === "stabilizer" && (
        <Stabilizer id={id} model={model} live={live} highlightSerial={highlightSerial} />
      )}
      {variant === "inverter" && <Inverter id={id} model={model} live={live} />}
      {variant === "mppt" && <Mppt id={id} model={model} live={live} />}
      {variant === "coil" && <Coil id={id} model={model} />}
    </svg>
  );
}

export function mockForCategory(cat: string): MockVariant {
  if (cat === "inverters") return "inverter";
  if (cat === "mppt") return "mppt";
  if (cat === "wires") return "coil";
  return "stabilizer";
}
