"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import ProductMock from "../ProductMock";
import { Btn, Eyebrow, Headline, Pic, Reveal, UrduLine } from "../UI";
import { IconArrow, IconArrowUpRight } from "../Icons";
import { categories } from "@/data/categories";
import { useLang } from "../Providers";
import { gsap, useGSAP, DESKTOP } from "@/lib/gsap";

function Card({ c, i }: { c: (typeof categories)[number]; i: number }) {
  return (
    <Link
      href={`/products/?cat=${c.key}`}
      className="sig-border group relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[22px] bg-navy-900 lg:h-full lg:w-auto"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Pic
          name={c.image}
          alt=""
          position="center"
          sizes="(max-width: 1023px) 82vw, 30vw"
          className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,26,.35) 0%, rgba(5,10,26,.1) 32%, rgba(5,10,26,.88) 78%, rgba(5,10,26,.96) 100%)",
        }}
      />

      {/* product mock floating in the card */}
      {c.mock !== "coil" && (
        <div className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center opacity-95 transition-transform duration-700 group-hover:-translate-y-2">
          <ProductMock
            variant={c.mock}
            model={c.chip.split(" ")[0]}
            live={false}
            className={
              c.mock === "mppt"
                ? "w-[62%] drop-shadow-[0_26px_50px_rgba(0,0,0,.65)]"
                : "w-[42%] drop-shadow-[0_26px_50px_rgba(0,0,0,.65)]"
            }
          />
        </div>
      )}
      {c.mock === "coil" && (
        <div className="pointer-events-none absolute inset-x-0 top-[10%] flex justify-center transition-transform duration-700 group-hover:-translate-y-2">
          <ProductMock
            variant="coil"
            model="RW-7/29"
            live={false}
            className="w-[60%] drop-shadow-[0_26px_50px_rgba(0,0,0,.65)]"
          />
        </div>
      )}

      <span className="absolute left-5 top-5 rounded-full border border-white/18 bg-black/25 px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-ice/85 backdrop-blur-sm">
        {c.num}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <span className="mono-label mb-3 inline-block rounded-full border border-navy-700 bg-navy-900/70 px-2.5 py-1 text-[10px] text-steel backdrop-blur-sm">
          {c.chip}
        </span>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="h3 text-ice">{c.title}</h3>
            <p className="mt-2 max-w-[30ch] text-[14px] leading-relaxed text-steel">
              {c.line}
            </p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-ice transition-all duration-400 group-hover:border-reena-red group-hover:bg-reena-red">
            <IconArrow
              width={18}
              height={18}
              className="transition-transform duration-400 group-hover:-rotate-45"
            />
          </span>
        </div>
      </div>
      <span className="sr-only">View {c.title}</span>
    </Link>
  );
}

export default function CategoryRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);
  const { t } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const el = track.current;
        const st = stage.current;
        if (!el || !st) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80);
        if (distance() <= 0) return;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: st,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: st,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        const bar = gsap.to(".js-rail-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: st,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
          },
        });
        return () => {
          tween.kill();
          bar.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-paper text-ink"
      aria-labelledby="range-h2"
    >
      <div className="sec pb-0">
        <div className="shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[640px]">
              <Eyebrow tone="light">OUR RANGE</Eyebrow>
              <Headline as="h2" className="h2 mt-5 text-ink" >
                {t("s3.h2")}
              </Headline>
              <UrduLine className="mt-4 text-slate">
                چار پروڈکٹ لائنز، ایک بھروسہ
              </UrduLine>
              <Reveal>
                <p className="body-lg mt-5 max-w-[52ch] text-slate">
                  From the stabilizer that protects your fridge to the wire inside
                  your walls, every Reena product is made in our own facility.
                </p>
              </Reveal>
            </div>
            <Reveal className="hidden lg:block">
              <Btn href="/products/" tone="ghost">
                See all products
                <IconArrowUpRight width={17} height={17} />
              </Btn>
            </Reveal>
          </div>
        </div>

        {/* desktop: the rail pins on its own, so the cards always fit the viewport */}
        <div className="hidden lg:block">
          <div
            ref={stage}
            className="flex h-screen flex-col justify-center overflow-hidden"
          >
            <div
              ref={track}
              className="flex w-max gap-6 pl-[max(56px,calc((100vw-1320px)/2+56px))] pr-14"
            >
              {categories.map((c, i) => (
                <div key={c.key} className="h-[min(62vh,460px)] shrink-0">
                  <Card c={c} i={i} />
                </div>
              ))}
              <Link
                href="/products/"
                className="group grid h-[min(62vh,460px)] w-[300px] shrink-0 place-items-center rounded-[22px] border border-line bg-mist"
              >
                <span className="flex flex-col items-center gap-4 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-reena-red text-white transition-transform duration-400 group-hover:scale-110">
                    <IconArrow width={24} height={24} />
                  </span>
                  <span className="h3 text-ink">See all products</span>
                  <span className="mono-label text-slate">11 MODELS · SAMPLE</span>
                </span>
              </Link>
            </div>
            <div className="shell mt-10">
              <div className="h-px w-full bg-line">
                <div
                  className="js-rail-progress sig-line h-px w-full origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* mobile: scroll-snap row */}
        <div className="lg:hidden">
          <div
            ref={scroller}
            onScroll={(e) => {
              const el = e.currentTarget;
              setDot(Math.round((el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 3));
            }}
            className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
          >
            {categories.map((c, i) => (
              <div key={c.key} className="w-[82%] shrink-0 snap-center">
                <Card c={c} i={i} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {categories.map((c, i) => (
              <span
                key={c.key}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === dot ? 22 : 6,
                  background: i === dot ? "var(--color-reena-red)" : "var(--color-line)",
                }}
              />
            ))}
          </div>
          <div className="shell mt-10 pb-4">
            <Btn href="/products/" tone="ghost" className="w-full">
              See all products
              <IconArrow width={17} height={17} />
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
