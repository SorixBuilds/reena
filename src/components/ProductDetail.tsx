"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductMock, { mockForCategory } from "./ProductMock";
import ProductCard from "./ProductCard";
import ReenaWave from "./ReenaWave";
import { Btn, CountUp, Eyebrow, Headline, Reveal, SampleChip } from "./UI";
import { IconArrow, IconCheck, IconDownload, IconWhatsApp } from "./Icons";
import { useToast } from "./Providers";
import { wa, waText } from "@/config/site";
import { related, type Product } from "@/data/products";
import { categoryLabel } from "@/data/categories";
import { prefersReduced } from "@/lib/gsap";

export default function ProductDetail({ product: p }: { product: Product }) {
  const [drag, setDrag] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const { toast } = useToast();
  const variant = mockForCategory(p.category);
  const rel = related(p.slug);

  useEffect(() => {
    const up = () => (dragging.current = false);
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      const d = (e.clientX - startX.current) / 8;
      setDrag(Math.max(-25, Math.min(25, d)) / 25);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <>
      {/* ── top ── */}
      <section className="relative overflow-hidden bg-night pt-[84px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(41,67,142,.6) 0%, transparent 60%)",
          }}
        />
        <div className="shell relative py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-steel">
            <Link href="/" className="transition-colors hover:text-ice">Home</Link>
            <span className="text-steel/40">/</span>
            <Link href="/products/" className="transition-colors hover:text-ice">Products</Link>
            <span className="text-steel/40">/</span>
            <Link
              href={`/products/?cat=${p.category}`}
              className="transition-colors hover:text-ice"
            >
              {categoryLabel[p.category]}
            </Link>
            <span className="text-steel/40">/</span>
            <span className="text-ice">{p.model}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* mock */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-40">
                <ReenaWave height={200} amplitude={34} cycles={1.8} strokeWidth={1.6} />
              </div>
              <div
                onPointerDown={(e) => {
                  dragging.current = true;
                  startX.current = e.clientX;
                }}
                className="relative mx-auto w-[min(76%,340px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
                style={{
                  transform: `perspective(1200px) rotateY(${drag * 25}deg)`,
                  transition: dragging.current ? "none" : "transform .7s cubic-bezier(.2,.9,.3,1)",
                }}
              >
                <ProductMock
                  variant={variant}
                  model={p.model}
                  highlightSerial={variant === "stabilizer"}
                  className={`w-full drop-shadow-[0_40px_70px_rgba(0,0,0,.6)] ${
                    prefersReduced() || dragging.current ? "" : "float-slow"
                  }`}
                />
              </div>
              <p className="mono-label mt-6 text-center text-[9.5px] text-steel/60">
                Drag to rotate · illustration, not a photo
              </p>
            </div>

            {/* info */}
            <div>
              <Eyebrow>{categoryLabel[p.category]} · SAMPLE</Eyebrow>
              <div className="mt-5 font-mono text-[15px] tracking-[0.1em] text-blue-glow">
                {p.model}
              </div>
              <Headline as="h1" className="h2 mt-2 text-ice" immediate>
                {p.name}
              </Headline>

              <div className="mt-6">
                <div className="mono-label mb-2.5 text-[10px] text-steel/70">Best for</div>
                <div className="flex flex-wrap gap-2">
                  {p.bestFor.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-800/60 px-3 py-1.5 text-[13px] text-ice"
                    >
                      <IconCheck width={14} height={14} className="text-safe" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3 border-y border-navy-700 py-7">
                {p.keyStats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[clamp(18px,4.6vw,30px)] font-extrabold leading-none text-ice">
                      <CountUp value={s.value} />
                    </div>
                    <div className="mono-label mt-2 text-[9px] leading-tight text-steel">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Btn href={wa(waText.product(p.model))} tone="red" external>
                  <IconWhatsApp width={17} height={17} />
                  Ask on WhatsApp
                </Btn>
                <Btn tone="navy" onClick={() => toast()}>
                  <IconDownload width={17} height={17} />
                  Download datasheet
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── specs ── */}
      <section className="bg-paper py-20 text-ink md:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <div className="sticky top-[96px] z-10 -mx-1 mb-2 flex flex-wrap items-center justify-between gap-3 bg-paper/95 px-1 py-3 backdrop-blur-sm">
                <h2 className="h3 text-ink">Specifications</h2>
                <SampleChip />
              </div>
              <dl className="border-t border-line">
                {p.specs.map(([k, v], i) => (
                  <Reveal
                    key={k}
                    delay={Math.min(i * 0.03, 0.3)}
                    className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <dt className="text-[14px] text-slate">{k}</dt>
                    <dd className="font-mono text-[14.5px] text-ink sm:text-right">{v}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>

            <div className="space-y-4">
              <Reveal className="rounded-[20px] border border-line bg-mist p-6">
                <h3 className="text-[17px] font-semibold text-ink">In the box</h3>
                <ul className="mt-4 space-y-2.5">
                  {(p.inBox || []).map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14.5px] text-slate">
                      <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-reena-red" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.08} className="rounded-[20px] border border-line bg-mist p-6">
                <h3 className="text-[17px] font-semibold text-ink">Warranty</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate">
                  To be confirmed by Reena.
                </p>
                <p className="mono-label mt-4 text-[9.5px] text-slate/60">
                  Warranty terms appear in the final website
                </p>
              </Reveal>

              <Reveal delay={0.14} className="rounded-[20px] border border-line bg-paper p-6">
                <h3 className="text-[17px] font-semibold text-ink">Not sure which model?</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate">
                  Send us your appliance list and we&rsquo;ll suggest the right one.
                </p>
                <Btn
                  href={wa(waText.product(p.model))}
                  tone="red"
                  size="sm"
                  className="mt-4"
                  external
                >
                  <IconWhatsApp width={15} height={15} />
                  Ask Reena
                </Btn>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── related ── */}
      <section className="bg-mist py-20 text-ink md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h3 text-ink">You might also need</h2>
            <Link
              href="/products/"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-reena-red"
            >
              All products
              <IconArrow width={15} height={15} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {rel.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
