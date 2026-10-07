"use client";

import { useRef, useState } from "react";
import ProductMock from "../ProductMock";
import { Btn, CountUp, Eyebrow, Headline, SampleChip } from "../UI";
import { IconArrow, IconWhatsApp } from "../Icons";
import { wa, waText } from "@/config/site";
import { gsap, useGSAP, DESKTOP, MOBILE, prefersReduced } from "@/lib/gsap";

const callouts = [
  { value: "5000 W", label: "Rated capacity", side: "left", y: 24 },
  { value: "100–260 V", label: "Working input range", side: "right", y: 40 },
  { value: "220 V ±3%", label: "Steady output", side: "left", y: 62 },
  { value: "Digital display", label: "Input / output at a glance", side: "right", y: 78 },
];

export default function ProductSpotlight() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=1800",
            pin: stage.current,
            scrub: 0.9,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => setTilt(self.progress * 2 - 1),
          },
        });

        callouts.forEach((_, i) => {
          tl.fromTo(
            `.js-callout-${i}`,
            { opacity: 0, x: callouts[i].side === "left" ? -40 : 40 },
            { opacity: 1, x: 0, duration: 1 },
            i * 1.1
          );
          const line = root.current?.querySelector<SVGPathElement>(`.js-leader-${i}`);
          if (line) {
            const len = line.getTotalLength();
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(line, { strokeDashoffset: 0, duration: 0.8 }, i * 1.1);
          }
          if (i < callouts.length - 1) {
            tl.to(`.js-callout-${i}`, { opacity: 0.25, duration: 0.6 }, i * 1.1 + 1.5);
          }
        });
        return () => void tl.kill();
      });

      mm.add(MOBILE, () => {
        if (prefersReduced()) return;
        gsap.fromTo(
          ".js-stat-tile",
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.09,
            scrollTrigger: { trigger: ".js-stat-grid", start: "top 85%", once: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-navy-900" aria-labelledby="spot-h2">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(110,139,255,.4) 0%, transparent 65%)",
        }}
      />

      {/* ── desktop: pinned stage sized to the viewport ── */}
      <div className="hidden lg:block">
        <div
          ref={stage}
          className="relative flex h-screen flex-col justify-center overflow-hidden"
        >
          <div className="shell relative">
            <div className="mx-auto max-w-[700px] text-center">
              <Eyebrow className="justify-center">FLAGSHIP · SAMPLE</Eyebrow>
              <Headline as="h2" className="h2 mt-4 text-ice">
                RS-5000. Built for the 1.5-ton AC.
              </Headline>
              <div className="mt-4 flex justify-center">
                <SampleChip tone="dark" />
              </div>
            </div>

            <div className="relative mx-auto mt-8 h-[min(48vh,440px)] max-w-[1000px]">
              {/* leader lines */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1000 520"
                preserveAspectRatio="none"
                aria-hidden="true"
                fill="none"
              >
                {callouts.map((c, i) => (
                  <path
                    key={i}
                    className={`js-leader-${i}`}
                    d={
                      c.side === "left"
                        ? `M440 ${(c.y / 100) * 520} H 300 L 260 ${(c.y / 100) * 520}`
                        : `M560 ${(c.y / 100) * 520} H 700 L 740 ${(c.y / 100) * 520}`
                    }
                    stroke="url(#spot-grad)"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <defs>
                  <linearGradient id="spot-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#C8232B" />
                    <stop offset="1" stopColor="#6E8BFF" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
                <ProductMock
                  variant="stabilizer"
                  model="RS-5000"
                  layered
                  tilt={tilt}
                  className="h-full w-auto drop-shadow-[0_40px_80px_rgba(0,0,0,.6)]"
                />
              </div>

              {callouts.map((c, i) => (
                <div
                  key={i}
                  className={`js-callout-${i} absolute max-w-[230px] ${
                    c.side === "left" ? "text-right" : "text-left"
                  }`}
                  style={{
                    top: `${c.y}%`,
                    [c.side === "left" ? "right" : "left"]: "76%",
                    transform: "translateY(-50%)",
                    opacity: 0,
                  }}
                >
                  <div className="font-display text-[clamp(28px,2.4vw,40px)] font-extrabold leading-none text-ice">
                    <CountUp value={c.value} />
                  </div>
                  <div className="mono-label mt-2 text-[10.5px] text-steel">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shell relative flex flex-wrap justify-center gap-3 pb-28">
          <Cta />
        </div>
      </div>

      {/* ── mobile ── */}
      <div className="sec relative lg:hidden">
        <div className="shell">
          <div className="mx-auto max-w-[700px] text-center">
            <Eyebrow className="justify-center">FLAGSHIP · SAMPLE</Eyebrow>
            <Headline as="h2" className="h2 mt-5 text-ice">
              RS-5000. Built for the 1.5-ton AC.
            </Headline>
            <div className="mt-5 flex justify-center">
              <SampleChip tone="dark" />
            </div>
          </div>

          <div className="mx-auto mt-12 w-[190px]">
            <ProductMock
              variant="stabilizer"
              model="RS-5000"
              className={`w-full drop-shadow-[0_30px_60px_rgba(0,0,0,.6)] ${
                prefersReduced() ? "" : "float-slow"
              }`}
            />
          </div>

          <div className="js-stat-grid mt-12 grid grid-cols-2 gap-3">
            {callouts.map((c, i) => (
              <div
                key={i}
                className="js-stat-tile rounded-2xl border border-navy-700 bg-navy-800/60 p-4"
                style={{ opacity: 0 }}
              >
                <div className="font-display text-[clamp(20px,5.6vw,28px)] font-extrabold leading-none text-ice">
                  <CountUp value={c.value} />
                </div>
                <div className="mono-label mt-2 text-[9.5px] leading-snug text-steel">
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Cta />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <>
      <Btn href="/products/rs-5000/" tone="red">
        View RS-5000
        <IconArrow
          width={17}
          height={17}
          className="transition-transform group-hover:translate-x-1"
        />
      </Btn>
      <Btn href={wa(waText.product("RS-5000"))} tone="navy" external>
        <IconWhatsApp width={17} height={17} />
        Ask on WhatsApp
      </Btn>
    </>
  );
}
