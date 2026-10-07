"use client";

import { Btn, Eyebrow, Headline, Reveal, UrduLine } from "../UI";
import { IconArrowUpRight, IconPhone, IconPin, IconWhatsApp } from "../Icons";
import ReenaWave from "../ReenaWave";
import { site, wa, waText } from "@/config/site";
import { prefersReduced } from "@/lib/gsap";

function MapVisual() {
  return (
    <svg
      viewBox="0 0 600 340"
      className="h-full w-full"
      role="img"
      aria-label="Stylised map showing Ghotki"
      fill="none"
    >
      <defs>
        <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0A1330" />
          <stop offset="1" stopColor="#050A1A" />
        </linearGradient>
      </defs>
      <rect width="600" height="340" fill="url(#map-bg)" />

      {/* grid */}
      <g stroke="#1A2A5C" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="340" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
        ))}
      </g>

      {/* river + roads */}
      <path
        d="M-10 120 C 110 150, 170 90, 280 130 S 460 210, 620 180"
        stroke="#1F3570"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M-10 250 C 140 240, 220 210, 300 200 S 480 150, 620 140"
        stroke="#2C3F75"
        strokeWidth="3"
        strokeDasharray="10 8"
      />
      <path d="M300 -10 V 350" stroke="#2C3F75" strokeWidth="3" strokeDasharray="10 8" />

      <text
        x="24"
        y="320"
        fill="#A3AECB"
        opacity="0.6"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: 12, letterSpacing: "0.14em" }}
      >
        BY PASS ROAD · GHOTKI, SINDH
      </text>

      {/* marker */}
      <g transform="translate(300 200)">
        {!prefersReduced() && (
          <circle r="10" fill="#C8232B" opacity="0.45" className="pulse-ring" />
        )}
        <circle r="9" fill="#C8232B" />
        <circle r="9" fill="none" stroke="#F2F5FF" strokeWidth="2.5" />
        <g transform="translate(18 -6)">
          <text
            fill="#F2F5FF"
            style={{ fontFamily: "var(--font-display), sans-serif", fontSize: 17, fontWeight: 700 }}
          >
            Jan Electrical
          </text>
          <text
            y="18"
            fill="#A3AECB"
            style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11 }}
          >
            Near Qoumi Bachat Bank
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function ContactPage() {
  const cards = [
    {
      icon: IconWhatsApp,
      kicker: "FASTEST",
      title: "WhatsApp",
      value: site.whatsappDisplay,
      href: wa(waText.general),
      tone: "red" as const,
      line: "Send a photo of your appliance list and we'll suggest a model.",
    },
    {
      icon: IconPhone,
      kicker: "DIRECT",
      title: "Call",
      value: site.phoneDisplay,
      href: `tel:${site.phoneE164}`,
      tone: "navy" as const,
      line: "Speak to the Reena team at the shop.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-night pt-[84px]">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-45">
          <ReenaWave height={120} amplitude={22} cycles={2.8} strokeWidth={1.6} />
        </div>
        <div className="shell relative py-16 md:py-20">
          <div className="max-w-[620px]">
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <Headline as="h1" className="h-display mt-5 text-ice" immediate>
              Talk to Reena.
            </Headline>
            <UrduLine size="lg" className="mt-4 text-steel">
              رینا سے بات کریں
            </UrduLine>
            <p className="body-lg mt-5 max-w-[42ch] text-steel">
              Dealer, installer or home user, we reply on WhatsApp.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="sig-border group flex h-full flex-col justify-between rounded-[24px] border border-navy-700 bg-navy-900/70 p-7 transition-colors hover:border-navy-700/80 md:p-9"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`grid h-14 w-14 place-items-center rounded-full ${
                          c.tone === "red"
                            ? "bg-reena-red text-white"
                            : "border border-navy-700 bg-navy-800 text-ice"
                        }`}
                      >
                        <c.icon width={24} height={24} />
                      </span>
                      <span className="mono-label text-[9.5px] text-steel/60">{c.kicker}</span>
                    </div>
                    <h2 className="mt-7 text-[15px] font-medium text-steel">{c.title}</h2>
                    <p className="mt-1 font-display text-[clamp(26px,5.4vw,38px)] font-extrabold leading-none text-ice">
                      {c.value}
                    </p>
                    <p className="mt-4 max-w-[34ch] text-[14.5px] leading-relaxed text-steel">
                      {c.line}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-red-bright">
                    Open
                    <IconArrowUpRight
                      width={16}
                      height={16}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* visit */}
      <section className="sec bg-paper text-ink">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-14">
            <div>
              <Eyebrow tone="light">VISIT THE SHOP</Eyebrow>
              <Headline as="h2" className="h2 mt-5 text-ink">
                {site.shop}
              </Headline>
              <p className="body-lg mt-5 max-w-[34ch] text-slate">{site.address}</p>

              <dl className="mt-8 space-y-4 border-t border-line pt-8">
                <div className="flex justify-between gap-6">
                  <dt className="text-[14px] text-slate">Owner</dt>
                  <dd className="text-[14.5px] font-medium text-ink">{site.owner}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[14px] text-slate">Hours</dt>
                  <dd className="text-[14.5px] font-medium text-ink">To be confirmed</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-[14px] text-slate">Trademark</dt>
                  <dd className="font-mono text-[14.5px] text-ink">
                    No. {site.trademarkNo}
                  </dd>
                </div>
              </dl>

              <Btn href={site.mapsUrl} tone="red" className="mt-8" external>
                <IconPin width={17} height={17} />
                Open in Google Maps
              </Btn>
            </div>

            <Reveal className="overflow-hidden rounded-[24px] border border-line">
              <div className="aspect-[16/10] w-full">
                <MapVisual />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
