"use client";

import { site } from "@/config/site";

const items = [
  "Own manufacturing",
  `Registered Trademark No. ${site.trademarkNo}`,
  "Dealers across Pakistan",
  "Stabilizers",
  "Solar Inverters",
  "MPPT Chargers",
  "Electrical Wires",
  "Ghotki, Sindh",
];

function Glyph() {
  return (
    <svg width="13" height="15" viewBox="0 0 120 142" aria-hidden="true" className="shrink-0">
      <path
        d="M12 30 L30 8 L90 8 L108 30 L108 68 C108 100 92 120 60 134 C28 120 12 100 12 68 Z"
        fill="#C8232B"
      />
    </svg>
  );
}

export default function TrustStrip() {
  const row = [...items, ...items];
  return (
    <section
      className="marquee relative flex h-[72px] items-center overflow-hidden border-y border-navy-700/60 bg-navy-900"
      aria-label="Reena at a glance"
    >
      <div className="marquee-track flex w-max shrink-0 items-center">
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-6 pr-6" aria-hidden={i >= items.length}>
            <Glyph />
            <span className="mono-label whitespace-nowrap text-[11.5px] text-steel">
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-navy-900 to-transparent" />
    </section>
  );
}
