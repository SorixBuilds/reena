"use client";

import DealerMap from "../DealerMap";
import { Btn, Eyebrow, Headline, Reveal, UrduLine } from "../UI";
import { IconArrow, IconLayers, IconTruck, IconWhatsApp } from "../Icons";
import { useLang } from "../Providers";
import { wa, waText } from "@/config/site";

export const benefits = [
  {
    icon: IconTruck,
    title: "Direct from the manufacturer",
    line: "No middlemen between you and the factory.",
  },
  {
    icon: IconLayers,
    title: "One supplier, full range",
    line: "Stabilizers, inverters, chargers and wires from one brand.",
  },
  {
    icon: IconWhatsApp,
    title: "WhatsApp support",
    line: "Talk to the Reena team directly.",
  },
];

export function BenefitCards({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      {benefits.map((b, i) => (
        <Reveal
          key={b.title}
          delay={i * 0.08}
          className={`sig-border rounded-[20px] border p-6 ${
            tone === "dark"
              ? "border-navy-700 bg-navy-800/60"
              : "border-line bg-paper"
          }`}
        >
          <span
            className={`grid h-12 w-12 place-items-center rounded-full ${
              tone === "dark" ? "bg-reena-red/14 text-red-bright" : "bg-mist text-reena-red"
            }`}
          >
            <b.icon width={21} height={21} />
          </span>
          <h3
            className={`mt-5 text-[17px] font-semibold ${
              tone === "dark" ? "text-ice" : "text-ink"
            }`}
          >
            {b.title}
          </h3>
          <p
            className={`mt-2 text-[14.5px] leading-relaxed ${
              tone === "dark" ? "text-steel" : "text-slate"
            }`}
          >
            {b.line}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

export default function Dealers() {
  const { t } = useLang();

  return (
    <section className="sec relative overflow-hidden bg-night" aria-labelledby="dealers-h2">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[560px] w-[560px] translate-x-1/3 opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(200,35,43,.5) 0%, transparent 65%)",
        }}
      />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>FOR DEALERS</Eyebrow>
            <Headline as="h2" className="h2 mt-5 text-ice">
              {t("s9.h2")}
            </Headline>
            <UrduLine className="mt-4 text-steel">اپنے شہر میں رینا کے ڈیلر بنیں</UrduLine>
            <Reveal>
              <p className="body-lg mt-5 max-w-[46ch] text-steel">
                Reena supplies dealers across Pakistan, directly from the
                manufacturer.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
              <Btn href="/dealers/" tone="red">
                Become a dealer
                <IconArrow width={17} height={17} className="transition-transform group-hover:translate-x-1" />
              </Btn>
              <Btn href={wa(waText.dealer)} tone="navy" external>
                <IconWhatsApp width={17} height={17} />
                WhatsApp us
              </Btn>
            </Reveal>
          </div>

          <DealerMap className="mx-auto w-full max-w-[460px]" />
        </div>

        <div className="mt-16">
          <BenefitCards />
        </div>
      </div>
    </section>
  );
}
