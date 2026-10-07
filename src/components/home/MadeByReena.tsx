"use client";

import { useRef } from "react";
import { Eyebrow, Headline, ImageReveal, Pic, Reveal, UrduLine } from "../UI";
import { IconChat, IconCopper, IconFactoryLine } from "../Icons";
import { useLang } from "../Providers";
import { gsap, useGSAP, DESKTOP } from "@/lib/gsap";

const points = [
  {
    icon: IconFactoryLine,
    title: "Own production line",
    line: "Built by our team, not imported in boxes.",
  },
  {
    icon: IconCopper,
    title: "Copper inside",
    line: "Copper windings and wiring.",
  },
  {
    icon: IconChat,
    title: "Dealer support",
    line: "Direct line to the manufacturer on WhatsApp.",
  },
];

export default function MadeByReena() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        [
          [".js-par-1", -70],
          [".js-par-2", 50],
          [".js-par-3", -30],
        ].forEach(([sel, y]) => {
          gsap.to(sel as string, {
            y: y as number,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="sec bg-paper text-ink" aria-labelledby="mfg-h2">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
          {/* collage */}
          <div className="relative order-2 h-[380px] sm:h-[480px] lg:order-1 lg:h-[620px]">
            <div className="js-par-1 absolute left-0 top-0 w-[58%]">
              <ImageReveal className="rounded-[18px]">
                <Pic
                  name="mfg-soldering"
                  alt="An engineer soldering a circuit board under a lamp"
                  sizes="(max-width: 1023px) 58vw, 26vw"
                  className="aspect-[4/5] w-full"
                />
              </ImageReveal>
            </div>

            <div className="js-par-2 absolute bottom-[8%] right-0 w-[52%]">
              <ImageReveal className="rounded-[18px]" delay={0.12}>
                <div className="relative">
                  <Pic
                    name="mfg-hands"
                    alt="Hands assembling electronics"
                    sizes="(max-width: 1023px) 52vw, 24vw"
                    className="aspect-[3/4] w-full"
                  />
                  <span className="mono-label absolute bottom-3 left-3 right-3 rounded-full bg-night/80 px-3 py-1.5 text-center text-[9px] text-ice backdrop-blur-sm">
                    Your factory photos go here
                  </span>
                </div>
              </ImageReveal>
            </div>

            <div className="js-par-3 absolute left-[14%] top-[46%] hidden w-[38%] sm:block">
              <ImageReveal className="rounded-[18px]" delay={0.22}>
                <Pic
                  name="mfg-coils"
                  alt="Workbench with components under a microscope"
                  sizes="30vw"
                  className="aspect-square w-full"
                />
              </ImageReveal>
            </div>
          </div>

          {/* copy */}
          <div className="order-1 lg:order-2">
            <Eyebrow tone="light">OUR OWN MANUFACTURING</Eyebrow>
            <Headline as="h2" className="h2 mt-5 text-ink">
              Made in our own facility. Checked before it leaves.
            </Headline>
            <UrduLine className="mt-4 text-slate">رینا کی اپنی تیاری</UrduLine>
            <Reveal>
              <p className="body-lg mt-5 max-w-[48ch] text-slate">
                We don&rsquo;t rebadge someone else&rsquo;s product. Reena designs
                and builds its range in Pakistan.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-5">
              {points.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 0.08} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-mist text-reena-red">
                    <p.icon width={21} height={21} />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-[14.5px] leading-relaxed text-slate">
                      {p.line}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
