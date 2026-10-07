"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MiniWave } from "../ReenaWave";
import { Btn, Eyebrow, Headline, SampleChip, UrduLine } from "../UI";
import { IconArrow, IconFridge, IconSnowflake, IconTv } from "../Icons";
import { useLang } from "../Providers";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

const MIN = 90;
const MAX = 280;
const LOW_CUT = 100;
const HIGH_CUT = 260;

type Status = { text: string; tone: "safe" | "warn" };

function Gauge({
  label,
  value,
  unit = "V",
  tone,
  cut,
}: {
  label: string;
  value: number;
  unit?: string;
  tone: "blue" | "red";
  cut?: boolean;
}) {
  const needle = useRef<SVGGElement>(null);
  const pct = Math.max(0, Math.min(1, (value - MIN) / (MAX - MIN)));
  const angle = -90 + pct * 180;

  useEffect(() => {
    if (!needle.current) return;
    // svgOrigin pivots in the SVG's own user space; transformOrigin would be
    // resolved against rendered CSS pixels and throw the needle off the dial
    gsap.to(needle.current, {
      rotation: angle,
      duration: prefersReduced() ? 0 : 0.9,
      ease: "elastic.out(1,0.6)",
      svgOrigin: "100 100",
    });
  }, [angle]);

  const accent = tone === "red" ? "#C8232B" : "#6E8BFF";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-[220px]" aria-hidden="true">
        {/* track */}
        <path
          d="M14 100 A86 86 0 0 1 186 100"
          fill="none"
          stroke="#1A2A5C"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* safe band 100–260 */}
        <path
          d="M14 100 A86 86 0 0 1 186 100"
          fill="none"
          stroke={accent}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${270 * 0.84} 400`}
          strokeDashoffset={-270 * 0.05}
          opacity="0.28"
        />
        {/* value arc */}
        <path
          d="M14 100 A86 86 0 0 1 186 100"
          fill="none"
          stroke={accent}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${270 * pct} 400`}
          style={{ transition: "stroke-dasharray .55s cubic-bezier(.2,.8,.3,1)" }}
        />
        {/* ticks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (-90 + (i / 10) * 180) * (Math.PI / 180);
          const r1 = 70;
          const r2 = 76;
          return (
            <line
              key={i}
              x1={100 + Math.sin(a) * r1}
              y1={100 - Math.cos(a) * r1}
              x2={100 + Math.sin(a) * r2}
              y2={100 - Math.cos(a) * r2}
              stroke="#3A4C82"
              strokeWidth="1.5"
            />
          );
        })}
        <g ref={needle} transform="rotate(-90 100 100)">
          <line
            x1="100"
            y1="104"
            x2="100"
            y2="32"
            stroke="#F2F5FF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="32" r="5" fill="#F2F5FF" />
          <circle cx="100" cy="32" r="2.2" fill={accent} />
        </g>
        <circle cx="100" cy="100" r="9" fill="#0A1330" stroke={accent} strokeWidth="2.5" />
      </svg>

      <div className="mono-label mt-1 text-[10.5px] text-steel">{label}</div>
      <div
        className="font-mono text-[40px] font-bold leading-none tracking-tight md:text-[48px]"
        style={{ color: cut ? "var(--color-warn)" : accent }}
      >
        {cut ? "CUT" : Math.round(value)}
        {!cut && <span className="ml-1 text-[18px] text-steel">{unit}</span>}
      </div>
    </div>
  );
}

function Appliance({
  icon: Icon,
  name,
  status,
  flicker,
}: {
  icon: typeof IconFridge;
  name: string;
  status: Status;
  flicker: boolean;
}) {
  const safe = status.tone === "safe";
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-2xl border p-2.5 text-center transition-colors duration-500 md:gap-3 md:p-5"
      style={{
        borderColor: safe ? "rgba(43,208,122,.3)" : "rgba(255,176,32,.32)",
        background: safe ? "rgba(43,208,122,.07)" : "rgba(255,176,32,.07)",
      }}
    >
      <span
        className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-xl md:h-14 md:w-14 ${
          flicker ? "flicker" : ""
        }`}
        style={{
          background: safe ? "rgba(43,208,122,.14)" : "rgba(255,176,32,.14)",
          color: safe ? "var(--color-safe)" : "var(--color-warn)",
        }}
      >
        {safe && !prefersReduced() && (
          <span
            className="pulse-ring absolute inset-0 rounded-xl"
            style={{ background: "rgba(43,208,122,.3)" }}
          />
        )}
        <Icon width={22} height={22} className="relative" />
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-medium leading-tight text-ice md:text-[13.5px]">
          {name}
        </div>
        <div
          className="mt-1 text-[10.5px] leading-tight md:text-[12px]"
          style={{ color: safe ? "var(--color-safe)" : "var(--color-warn)" }}
        >
          {status.text}
        </div>
      </div>
    </div>
  );
}

export default function VoltageSimulator() {
  const [v, setV] = useState(220);
  const [withReena, setWithReena] = useState(true);
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();

  const cut = withReena && (v < LOW_CUT || v > HIGH_CUT);
  const output = useMemo(() => {
    if (!withReena) return v;
    if (cut) return 0;
    return 220 + (((v * 37) % 5) - 2) * 0.6; // deterministic ±2V jitter
  }, [v, withReena, cut]);

  const statuses = useMemo<{ fridge: Status; ac: Status; tv: Status }>(() => {
    if (withReena) {
      if (cut) {
        const s: Status = { text: "Cut-off: appliances safe", tone: "warn" };
        return { fridge: s, ac: s, tv: s };
      }
      const s: Status = { text: t("s4.protected"), tone: "safe" };
      return { fridge: s, ac: s, tv: s };
    }
    if (v < 180) {
      return {
        fridge: { text: "Compressor strain", tone: "warn" },
        ac: { text: "Compressor strain", tone: "warn" },
        tv: { text: v < 170 ? "Flickering" : "OK", tone: v < 170 ? "warn" : "safe" },
      };
    }
    if (v > 245) {
      return {
        fridge: { text: "Over-voltage risk", tone: "warn" },
        ac: { text: "Over-voltage risk", tone: "warn" },
        tv: { text: v > 250 ? "Flickering" : "OK", tone: v > 250 ? "warn" : "safe" },
      };
    }
    const ok: Status = { text: "OK", tone: "safe" };
    return { fridge: ok, ac: ok, tv: ok };
  }, [v, withReena, cut, t]);

  const tvFlicker = !withReena && (v < 170 || v > 250);
  const jitter = withReena ? (cut ? 0 : 0) : Math.min(34, Math.abs(v - 220) * 0.55);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo(
        ".js-sim-panel",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        }
      );
    },
    { scope: root }
  );

  const chips = [
    { label: "Load-shedding evening (150V)", v: 150 },
    { label: "Normal (220V)", v: 220 },
    { label: "Surge (265V)", v: 265 },
  ];

  return (
    <section ref={root} className="sec relative overflow-hidden bg-night" aria-labelledby="sim-h2">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 opacity-[.16]"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-reena-blue) 0%, transparent 68%)",
        }}
      />
      <div className="shell relative">
        <div className="max-w-[640px]">
          <Eyebrow>SEE IT WORK</Eyebrow>
          <Headline as="h2" className="h2 mt-5 text-ice">
            {t("s4.h2")}
          </Headline>
          <UrduLine className="mt-4 text-steel">اسٹیبلائزر کیا کرتا ہے؟ خود دیکھیں</UrduLine>
          <p className="body-lg mt-5 max-w-[48ch] text-steel">
            Drag the slider to the voltage in your area. Watch what reaches your
            appliances.
          </p>
        </div>

        <div className="js-sim-panel mt-12 overflow-hidden rounded-[26px] border border-navy-700 bg-navy-900/70 backdrop-blur-sm" style={{ opacity: 0 }}>
          {/* gauges */}
          <div className="relative grid grid-cols-2 gap-4 border-b border-navy-700/70 p-5 md:gap-10 md:p-10">
            <Gauge label="MAINS INPUT" value={v} tone="red" />
            <div className="relative">
              <Gauge label="REENA OUTPUT" value={cut ? MIN : output} tone="blue" cut={cut} />
              <div className="pointer-events-none absolute inset-x-0 -top-1 h-12 opacity-70">
                <MiniWave jitter={jitter} className="h-12 w-full" color={cut ? "#FFB020" : "#6E8BFF"} />
              </div>
            </div>
            <div className="col-span-2 flex flex-wrap items-center justify-center gap-2">
              <SampleChip label="Illustration · sample range 100–260 V" tone="dark" />
            </div>
          </div>

          {/* controls */}
          <div className="p-5 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="v-slider" className="mono-label text-[11px] text-steel">
                Your area&rsquo;s voltage
              </label>
              <span className="font-mono text-[20px] font-bold text-ice">
                {v}
                <span className="ml-1 text-[13px] text-steel">V</span>
              </span>
            </div>
            <input
              id="v-slider"
              type="range"
              min={MIN}
              max={MAX}
              value={v}
              onChange={(e) => setV(Number(e.target.value))}
              className="v-slider mt-2"
              aria-label="Mains input voltage"
              aria-valuetext={`${v} volts`}
            />
            <div className="flex justify-between font-mono text-[11px] text-steel/60">
              <span>{MIN}V</span>
              <span>220V</span>
              <span>{MAX}V</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.v}
                  onClick={() => setV(c.v)}
                  className="rounded-full border px-3.5 py-2 text-[13px] transition-colors"
                  style={{
                    borderColor: v === c.v ? "var(--color-reena-red)" : "var(--color-navy-700)",
                    background: v === c.v ? "rgba(200,35,43,.14)" : "transparent",
                    color: v === c.v ? "var(--color-ice)" : "var(--color-steel)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* toggle */}
            <div className="mt-7 inline-flex w-full rounded-full border border-navy-700 bg-night p-1 sm:w-auto">
              {[true, false].map((on) => (
                <button
                  key={String(on)}
                  onClick={() => setWithReena(on)}
                  aria-pressed={withReena === on}
                  className="min-h-[46px] flex-1 rounded-full px-5 text-[14px] font-medium transition-colors sm:flex-none"
                  style={{
                    background: withReena === on ? "var(--color-reena-red)" : "transparent",
                    color: withReena === on ? "#fff" : "var(--color-steel)",
                  }}
                >
                  {on ? t("s4.with") : t("s4.without")}
                </button>
              ))}
            </div>

            {/* appliances */}
            <div className="mt-7 grid grid-cols-3 gap-2 md:gap-3">
              <Appliance icon={IconFridge} name="Refrigerator" status={statuses.fridge} flicker={false} />
              <Appliance icon={IconSnowflake} name="Air conditioner" status={statuses.ac} flicker={false} />
              <Appliance icon={IconTv} name="TV" status={statuses.tv} flicker={tvFlicker} />
            </div>
          </div>
        </div>

        <div className="js-sim-panel mt-8 flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
          <Btn href="/products/?cat=stabilizers" tone="red">
            Find the right stabilizer
            <IconArrow width={17} height={17} className="transition-transform group-hover:translate-x-1" />
          </Btn>
        </div>
      </div>
    </section>
  );
}
