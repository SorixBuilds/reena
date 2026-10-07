"use client";

import { useEffect, useId, useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

type Mode = "calm" | "chaos" | "loop" | "flat";

const W = 1200;
const H = 120;
const MID = H / 2;

const STEPS = 140;

/** clean sine, drawn one cycle past the viewBox so the drift can loop seamlessly */
function sinePath(amp = 26, cycles = 3, phase = 0, mid = MID, width = W) {
  let d = "";
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * width;
    const y = mid + Math.sin((x / W) * Math.PI * 2 * cycles + phase) * amp;
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
}

/** jagged, nervous mains line — same point count so GSAP can interpolate it */
function chaosPath(seed = 1, mid = MID, width = W) {
  let d = "";
  let rnd = seed * 9301;
  const next = () => {
    rnd = (rnd * 9301 + 49297) % 233280;
    return rnd / 233280;
  };
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * width;
    const spike = next() > 0.82 ? (next() - 0.5) * 70 : 0;
    const y = mid + (next() - 0.5) * 46 + spike;
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d;
}

export default function ReenaWave({
  mode = "loop",
  color = "var(--color-blue-glow)",
  className = "",
  height = 120,
  amplitude = 26,
  cycles = 3,
  strokeWidth = 2,
  glow = true,
  showLabel = false,
  label = "220V",
  /** bump this number to replay the chaos → calm morph */
  trigger = 0,
  opacity = 0.6,
}: {
  mode?: Mode;
  color?: string;
  className?: string;
  height?: number;
  amplitude?: number;
  cycles?: number;
  strokeWidth?: number;
  glow?: boolean;
  showLabel?: boolean;
  label?: string;
  trigger?: number;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const seed = useRef(1);

  // one extra cycle of width gives the drift something to slide in from
  const EXT = W + W / cycles;
  const calm = sinePath(amplitude, cycles, 0, MID, EXT);
  const flat = sinePath(0, cycles, 0, MID, EXT);
  const initial =
    mode === "flat" ? flat : mode === "chaos" ? chaosPath(1, MID, EXT) : calm;

  useGSAP(
    () => {
      if (mode === "flat" || prefersReduced()) return;
      const paths = gsap.utils.toArray<SVGPathElement>(".js-wave-path", root.current);
      if (!paths.length) return;

      const tl = gsap.timeline();
      if (mode !== "chaos") {
        seed.current += 1;
        tl.set(paths, { attr: { d: chaosPath(seed.current, MID, W + W / cycles) } }).to(
          paths,
          { attr: { d: calm }, duration: 1.4, ease: "expo.inOut" }
        );
      }

      // Drift the settled wave with a transform rather than rebuilding the path
      // each frame: the path is drawn one extra cycle wide, so sliding it left by
      // exactly one period loops seamlessly and costs nothing on the main thread.
      const group = root.current?.querySelector<SVGGElement>(".js-wave-drift");
      if (group) {
        tl.fromTo(
          group,
          { x: 0 },
          {
            x: -W / cycles,
            duration: 7,
            ease: "none",
            repeat: -1,
          },
          mode === "chaos" ? 0 : ">-0.3"
        );
      }
      return () => void tl.kill();
    },
    { scope: root, dependencies: [trigger, mode] }
  );

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      style={{ height, width: "100%", overflow: "visible" }}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <filter id={`${id}-glow`} x="-10%" y="-80%" width="120%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* the mask sits outside the drifting group, so the soft edges stay put */}
        <linearGradient
          id={`${id}-fade`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2={W}
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.88" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="-60" width={W} height={H + 120}>
          <rect x="0" y="-60" width={W} height={H + 120} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <g mask={`url(#${id}-mask)`}>
        <g className="js-wave-drift">
          {glow && (
            <path
              className="js-wave-path"
              d={initial}
              stroke={color}
              strokeWidth={strokeWidth * 3}
              filter={`url(#${id}-glow)`}
              opacity={opacity * 0.45}
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path
            className="js-wave-path"
            d={initial}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>

      {showLabel && (
        <text
          x={W - 10}
          y={MID - 14}
          textAnchor="end"
          fill={color}
          opacity={opacity + 0.25}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 20,
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}

/** Small inline wave used by the simulator — amplitude is driven from outside. */
export function MiniWave({
  jitter = 0,
  color = "var(--color-blue-glow)",
  className = "",
}: {
  jitter?: number;
  color?: string;
  className?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.setAttribute("d", sinePath(14, 4, 0, MID));
      return;
    }
    let raf = 0;
    let t = 0;
    const loop = () => {
      t += 0.045;
      const steps = 90;
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const noise = jitter > 0 ? Math.sin(i * 1.9 + t * 6) * jitter * 0.55 : 0;
        const y =
          MID + Math.sin((i / steps) * Math.PI * 2 * 4 + t) * (14 + jitter * 0.5) + noise;
        d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
      }
      el.setAttribute("d", d);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [jitter]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`${id}-f`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="0.15" stopColor={color} stopOpacity="1" />
          <stop offset="0.85" stopColor={color} stopOpacity="1" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        ref={ref}
        d={sinePath(14, 4)}
        stroke={`url(#${id}-f)`}
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
