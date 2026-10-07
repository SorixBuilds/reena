"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReenaWave from "../ReenaWave";
import { Btn, Pic, UrduLine } from "../UI";
import { IconArrow, IconWhatsApp } from "../Icons";
import { useLang } from "../Providers";
import { wa, waText } from "@/config/site";
import {
  gsap,
  useGSAP,
  revealLines,
  onFontsReady,
  prefersReduced,
  DESKTOP,
} from "@/lib/gsap";

const SLIDE_MS = 5500;

type Slide = {
  label: string;
  image: string;
  position: string;
  readout: { from: string; to: string } | { text: string };
  alt: string;
};

const slides: Slide[] = [
  {
    label: "01 · Voltage Stabilizers",
    image: "hero-coil",
    position: "55% 50%",
    readout: { from: "IN 168V", to: "OUT 220V" },
    alt: "Copper windings, close up",
  },
  {
    label: "02 · Solar Inverters",
    image: "hero-pcb-blue",
    position: "50% 50%",
    readout: { from: "PV 380V", to: "AC 220V" },
    alt: "Dark blue circuit board",
  },
  {
    label: "03 · MPPT & Solar Chargers",
    image: "hero-solar-dusk",
    position: "60% 50%",
    readout: { from: "PV 92V", to: "BAT 24V" },
    alt: "Solar panel field at dusk",
  },
  {
    label: "04 · Electrical Wires",
    image: "hero-copper-red",
    position: "45% 50%",
    readout: { text: "100% COPPER · 7/29" },
    alt: "Copper wire strands in red light",
  },
];

/* counts a "XX 168V" style readout up from zero */
function Readout({ slide, active }: { slide: Slide; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    if ("text" in slide.readout) return;
    if (prefersReduced()) return;
    const spans = ref.current.querySelectorAll<HTMLElement>("[data-num]");
    spans.forEach((el) => {
      const target = Number(el.dataset.num);
      const o = { n: 0 };
      gsap.to(o, {
        n: target,
        duration: 1.1,
        ease: "power2.out",
        snap: { n: 1 },
        onUpdate: () => (el.textContent = String(Math.round(o.n))),
      });
    });
  }, [active, slide]);

  const part = (s: string) => {
    const m = s.match(/^(\D*)(\d+)(\D*)$/);
    if (!m) return <span>{s}</span>;
    return (
      <>
        {m[1]}
        <span data-num={m[2]}>{m[2]}</span>
        {m[3]}
      </>
    );
  };

  return (
    <div
      ref={ref}
      className="font-mono text-[12px] tracking-[0.14em] text-blue-glow md:text-[13px]"
    >
      {"text" in slide.readout ? (
        slide.readout.text
      ) : (
        <>
          {part(slide.readout.from)}
          <span className="mx-2 text-steel/60">→</span>
          {part(slide.readout.to)}
        </>
      )}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(1); // how many slides are allowed to render
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const touch = useRef({ x: 0, y: 0 });
  const { t, isUr } = useLang();

  const go = useCallback((i: number) => setIndex(((i % 4) + 4) % 4), []);

  /* lazy-load slides 2–4 once the page is idle */
  useEffect(() => {
    const load = () => setLoaded(4);
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback || ((cb: () => void) => setTimeout(cb, 900));
    if (document.readyState === "complete") idle(load);
    else window.addEventListener("load", () => idle(load), { once: true });
  }, []);

  /* autoplay, paused when hidden or off screen */
  useEffect(() => {
    if (prefersReduced()) return;
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (paused || prefersReduced() || loaded < 4) return;
    const id = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, go, loaded]);

  /* entrance + desktop scroll-out */
  useGSAP(
    () => {
      const cancelFonts = onFontsReady(() => {
        revealLines(h1.current, { delay: 0.1 });
        gsap.fromTo(
          ".js-hero-fade",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, delay: 0.35 }
        );
      });

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        gsap.to(".js-hero-content", {
          y: -80,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".js-hero-media", {
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => {
        cancelFonts();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[600px] w-full flex-col justify-end overflow-hidden bg-night"
      /* min-height, not height: on a short or narrow phone the copy can exceed the
         viewport, and a fixed height pushes it up underneath the fixed header */
      style={{ minHeight: "100svh" }}
      aria-label="Reena — steady power"
    >
      {/* media */}
      <div className="js-hero-media absolute inset-0 -z-10">
        {slides.map((s, i) => (
          <div
            key={s.image}
            className="absolute inset-0"
            style={{
              opacity: i === index ? 1 : 0,
              transition: "opacity 1.2s cubic-bezier(.4,0,.2,1)",
            }}
            aria-hidden={i !== index}
          >
            {i < loaded && (
              <Pic
                name={s.image}
                alt={s.alt}
                priority={i === 0}
                portrait
                position={s.position}
                sizes="100vw"
                className="block h-full w-full"
                imgClassName={
                  prefersReduced() ? "" : i === index ? "hero-kenburns" : ""
                }
              />
            )}
          </div>
        ))}
      </div>

      {/* overlays */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,26,.55) 0%, rgba(5,10,26,.25) 40%, rgba(5,10,26,.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,10,26,.78) 0%, rgba(5,10,26,.3) 45%, rgba(5,10,26,0) 70%)",
        }}
      />

      {/* the Reena Wave behind the headline */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[34%] -z-10 md:bottom-[30%]"
        aria-hidden="true"
      >
        <ReenaWave
          key={index}
          height={120}
          amplitude={24}
          cycles={2.6}
          strokeWidth={2}
          showLabel
          label="220V"
          opacity={0.55}
          trigger={index}
        />
      </div>

      {/* content */}
      <div
        className="js-hero-content shell relative z-10 pb-[100px] pt-[104px] md:pb-[116px] md:pt-[116px]"
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.6)
            go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="max-w-[640px] lg:max-w-[58%]">
          <div
            className="js-hero-fade mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-5"
            style={{ opacity: 0 }}
          >
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.14em] text-ice/85 backdrop-blur-sm md:text-[11px]">
              {slides[index].label}
            </span>
            <Readout slide={slides[index]} active />
          </div>

          <div className="mono-label mb-3 text-[10.5px] text-steel md:mb-4 md:text-[12px]">
            REENA · WORLD CLASS
          </div>

          <h1
            key={isUr ? "ur" : "en"}
            ref={h1}
            lang={isUr ? "ur" : undefined}
            dir={isUr ? "rtl" : undefined}
            className={`h-display text-ice ${isUr ? "max-w-[14ch]" : "max-w-[11ch]"}`}
            style={
              isUr
                ? { fontFamily: "var(--font-urdu), serif", lineHeight: 1.75 }
                : undefined
            }
          >
            {t("hero.h1")}
          </h1>

          <UrduLine className="js-hero-fade mt-2 max-w-[22ch] text-ice/85 md:mt-4">
            بجلی جیسی بھی ہو، حفاظت رینا کی
          </UrduLine>

          <p
            className="js-hero-fade mt-5 max-w-[46ch] text-[15px] leading-relaxed text-steel md:mt-6 md:text-[19px]"
            style={{ opacity: 0 }}
          >
            Voltage stabilizers, solar inverters, MPPT chargers and electrical
            wires, manufactured by Reena and supplied to dealers across Pakistan.
          </p>

          <div
            className="js-hero-fade mt-6 flex flex-wrap gap-2.5 md:mt-8 md:gap-3"
            style={{ opacity: 0 }}
          >
            <Btn href="/products/" tone="red" className="md:px-8 md:py-4 md:text-[16px]">
              {t("cta.products")}
              <IconArrow width={18} height={18} className="transition-transform group-hover:translate-x-1" />
            </Btn>
            <Btn
              href={wa(waText.dealer)}
              tone="glass"
              className="md:px-8 md:py-4 md:text-[16px]"
              external
            >
              <IconWhatsApp width={18} height={18} />
              {t("cta.dealer")}
            </Btn>
          </div>
        </div>
      </div>

      {/* slide control */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="shell grid grid-cols-4 gap-2 md:max-w-[640px] md:mr-auto">
          {slides.map((s, i) => (
            <button
              key={s.label}
              onClick={() => go(i)}
              aria-label={`Show ${s.label.replace(/^\d+ · /, "")}`}
              aria-current={i === index}
              className="group pb-1 pt-3 text-left"
            >
              <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/22">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-reena-red"
                  style={{
                    width: i < index ? "100%" : i === index ? undefined : "0%",
                    animation:
                      i === index && !paused && loaded === 4 && !prefersReduced()
                        ? `hero-fill ${SLIDE_MS}ms linear forwards`
                        : i === index
                        ? undefined
                        : "none",
                    ...(i === index && (paused || loaded < 4) ? { width: "8%" } : {}),
                  }}
                />
              </span>
              <span
                className={`mt-2 hidden font-mono text-[10.5px] tracking-[0.1em] transition-colors sm:block ${
                  i === index ? "text-ice" : "text-steel/55 group-hover:text-steel"
                }`}
              >
                {s.label.replace(/^\d+ · /, "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-fill { from { width: 0% } to { width: 100% } }
        @keyframes hero-kb { from { transform: scale(1) } to { transform: scale(1.08) } }
        .hero-kenburns { animation: hero-kb 7s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) { .hero-kenburns { animation: none } }
      `}</style>
    </section>
  );
}
