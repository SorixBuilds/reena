"use client";

import { useRef, useState } from "react";
import { Eyebrow, Headline, Pic, UrduLine } from "../UI";
import { iconMap } from "../Icons";
import { applications } from "@/data/applications";
import { useLang } from "../Providers";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

export default function ApplicationsGrid() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      if (prefersReduced()) {
        gsap.set(".js-app-tile", { opacity: 1, clipPath: "inset(0%)" });
        return;
      }
      gsap.fromTo(
        ".js-app-tile",
        { opacity: 0, clipPath: "inset(14% 0 14% 0)", y: 20 },
        {
          opacity: 1,
          clipPath: "inset(0% 0 0% 0)",
          y: 0,
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".js-app-grid", start: "top 84%", once: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="sec bg-mist text-ink" aria-labelledby="apps-h2">
      <div className="shell">
        <div className="max-w-[640px]">
          <Eyebrow tone="light">USED FOR</Eyebrow>
          <Headline as="h2" className="h2 mt-5 text-ink">
            {t("s6.h2")}
          </Headline>
          <UrduLine className="mt-4 text-slate">جہاں بجلی ضروری ہے، وہاں رینا</UrduLine>
        </div>

        {/* 2 wide + 4 square = 8 cells, which fills exactly two rows of four */}
        <div className="js-app-grid mt-14 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {applications.map((a) => {
            const Icon = iconMap[a.icon];
            const isOpen = open === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setOpen(isOpen ? null : a.key)}
                onMouseEnter={() => {
                  if (window.matchMedia("(pointer: fine)").matches) setOpen(a.key);
                }}
                onMouseLeave={() => {
                  if (window.matchMedia("(pointer: fine)").matches) setOpen(null);
                }}
                className={`js-app-tile group relative aspect-square overflow-hidden rounded-[20px] bg-navy-900 text-left ${
                  a.wide ? "lg:col-span-2 lg:aspect-[8/3]" : "lg:aspect-[4/3]"
                }`}
                style={{ opacity: 0 }}
                aria-expanded={isOpen}
              >
                <Pic
                  name={a.image}
                  alt=""
                  position="center"
                  sizes="(max-width: 1023px) 50vw, 33vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,10,26,.15) 0%, rgba(5,10,26,.55) 55%, rgba(5,10,26,.93) 100%)",
                  }}
                />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-ice backdrop-blur-sm transition-colors duration-400 group-hover:border-reena-red group-hover:bg-reena-red md:h-11 md:w-11">
                  <Icon width={19} height={19} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <h3 className="font-display text-[clamp(16px,4.2vw,22px)] font-extrabold leading-tight text-ice">
                    {a.title}
                  </h3>
                  <p
                    className="overflow-hidden text-[13px] leading-relaxed text-steel transition-all duration-500"
                    style={{
                      maxHeight: isOpen ? 96 : 0,
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? 8 : 0,
                    }}
                  >
                    {a.line}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mono-label mt-8 text-[10.5px] text-slate/70">
          Tap a tile to read more
        </p>
      </div>
    </section>
  );
}
