"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import ReenaWave from "./ReenaWave";
import { Eyebrow, Headline, Reveal, SampleChip, UrduLine } from "./UI";
import { IconCheck } from "./Icons";
import { products, type Category } from "@/data/products";
import { useLang } from "./Providers";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

const filters: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "stabilizers", label: "Stabilizers" },
  { key: "inverters", label: "Solar Inverters" },
  { key: "mppt", label: "MPPT & Chargers" },
  { key: "wires", label: "Wires" },
];

const helper: { label: string; slug: string }[] = [
  { label: "Fridge", slug: "rs-1000" },
  { label: "1 AC", slug: "rs-5000" },
  { label: "2 ACs", slug: "rs-10000" },
  { label: "Whole house", slug: "rs-10000" },
];

export default function ProductsBrowser() {
  const params = useSearchParams();
  const [cat, setCat] = useState<Category | "all">("all");
  const [pick, setPick] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const q = params.get("cat");
    if (q && filters.some((f) => f.key === q)) setCat(q as Category);
  }, [params]);

  const list = useMemo(
    () => (cat === "all" ? products : products.filter((p) => p.category === cat)),
    [cat]
  );

  const suggested = pick ? helper.find((h) => h.label === pick)?.slug : null;

  useGSAP(
    () => {
      if (prefersReduced() || !grid.current) return;
      gsap.fromTo(
        grid.current.children,
        { opacity: 0, y: 18, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.035, ease: "power2.out" }
      );
    },
    { scope: grid, dependencies: [cat] }
  );

  return (
    <>
      {/* hero band */}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-night pt-[84px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 20% 110%, rgba(41,67,142,.55) 0%, transparent 62%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-10 opacity-45">
          <ReenaWave height={110} amplitude={20} cycles={3} strokeWidth={1.6} />
        </div>
        <div className="shell relative pb-14 pt-12">
          <Eyebrow>OUR RANGE · 11 MODELS</Eyebrow>
          <Headline as="h1" className="h-display mt-5 text-ice" immediate>
            {t("products.h1")}
          </Headline>
          <UrduLine size="lg" className="mt-3 text-steel">
            پروڈکٹس
          </UrduLine>
          <p className="body-lg mt-5 max-w-[44ch] text-steel">
            Browse the Reena range by category.
          </p>
        </div>
      </section>

      {/* filters */}
      <div className="sticky top-[72px] z-30 border-b border-line bg-paper/92 backdrop-blur-xl md:top-[84px]">
        <div className="shell no-scrollbar flex gap-2 overflow-x-auto py-4">
          {filters.map((f) => {
            const active = cat === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setCat(f.key);
                  setPick(null);
                }}
                aria-pressed={active}
                className="relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13.5px] font-medium transition-colors"
                style={{
                  borderColor: active ? "var(--color-reena-red)" : "var(--color-line)",
                  background: active ? "var(--color-reena-red)" : "var(--color-paper)",
                  color: active ? "#fff" : "var(--color-slate)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="bg-paper pb-24 pt-10 text-ink">
        <div className="shell">
          {/* which stabilizer helper */}
          {(cat === "stabilizers" || cat === "all") && (
            <Reveal className="mb-10 rounded-[20px] border border-line bg-mist p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-semibold text-ink md:text-[20px]">
                    Which stabilizer do I need?
                  </h2>
                  <p className="mt-1 text-[14px] text-slate">
                    Pick what you want to protect.
                  </p>
                </div>
                <SampleChip label="Suggestion only, confirm on WhatsApp" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {helper.map((h) => {
                  const on = pick === h.label;
                  return (
                    <button
                      key={h.label}
                      onClick={() => setPick(on ? null : h.label)}
                      aria-pressed={on}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[14px] transition-colors"
                      style={{
                        borderColor: on ? "var(--color-reena-red)" : "var(--color-line)",
                        background: on ? "rgba(200,35,43,.08)" : "var(--color-paper)",
                        color: on ? "var(--color-reena-red)" : "var(--color-slate)",
                      }}
                    >
                      <span
                        className="grid h-5 w-5 place-items-center rounded-md border"
                        style={{
                          borderColor: on ? "var(--color-reena-red)" : "var(--color-line)",
                          background: on ? "var(--color-reena-red)" : "transparent",
                          color: "#fff",
                        }}
                      >
                        {on && <IconCheck width={13} height={13} />}
                      </span>
                      {h.label}
                    </button>
                  );
                })}
              </div>
              {suggested && (
                <p className="mt-4 text-[14px] text-slate">
                  We&rsquo;d suggest the{" "}
                  <span className="font-mono font-semibold text-reena-red">
                    {products.find((p) => p.slug === suggested)?.model}
                  </span>{" "}
                  — highlighted below.
                </p>
              )}
            </Reveal>
          )}

          <div
            ref={grid}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4"
          >
            {list.map((p) => (
              <ProductCard key={p.slug} p={p} highlighted={p.slug === suggested} />
            ))}
          </div>

          <p className="mono-label mt-10 text-[10px] text-slate/70">
            All models and specifications shown are samples for this demo
          </p>
        </div>
      </section>
    </>
  );
}
