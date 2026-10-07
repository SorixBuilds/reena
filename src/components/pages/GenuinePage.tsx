"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductMock from "../ProductMock";
import ShieldMark from "../ShieldMark";
import { Btn, Eyebrow, Headline, Reveal, SampleChip, UrduLine } from "../UI";
import { IconAlert, IconCheck, IconSearch, IconWhatsApp } from "../Icons";
import { wa, waText } from "@/config/site";
import { gsap, prefersReduced } from "@/lib/gsap";

const PATTERN = /^RN-\d{2}-\d{6}$/i;
type Result = { ok: boolean; serial: string } | null;

const steps = [
  {
    n: "01",
    title: "Find the label",
    line: "On a stabilizer it's the sticker on the lower right of the front panel.",
  },
  {
    n: "02",
    title: "Read the format",
    line: "Reena serials look like RN-26-005812 — two digits for the year, six for the unit.",
  },
  {
    n: "03",
    title: "Check it here",
    line: "Type it above. Your dealer can check it from their own phone too.",
  },
];

export default function GenuinePage() {
  const params = useSearchParams();
  const [serial, setSerial] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);

  const run = useCallback((value: string) => {
    const v = value.trim();
    if (!v) return;
    setResult(null);
    setScanning(true);

    if (!prefersReduced() && digits.current) {
      const el = digits.current;
      const id = setInterval(() => {
        el.textContent = Array.from({ length: 12 }, () =>
          Math.random() > 0.5
            ? String(Math.floor(Math.random() * 10))
            : "ABCDEF"[Math.floor(Math.random() * 6)]
        ).join("");
      }, 60);
      setTimeout(() => clearInterval(id), 1600);
    }
    if (!prefersReduced() && scanRef.current) {
      gsap.fromTo(
        scanRef.current,
        { yPercent: -120 },
        { yPercent: 620, duration: 0.8, ease: "power1.inOut", repeat: 1 }
      );
    }

    setTimeout(() => {
      setScanning(false);
      setResult({ ok: PATTERN.test(v), serial: v.toUpperCase() });
    }, 1600);
  }, []);

  useEffect(() => {
    const q = params.get("s");
    if (q) {
      setSerial(q);
      run(q);
    }
  }, [params, run]);

  return (
    <>
      <section className="relative overflow-hidden bg-night pt-[84px]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(41,67,142,.6) 0%, transparent 58%)",
          }}
        />
        <div className="shell relative py-14 md:py-20">
          <div className="mx-auto max-w-[680px] text-center">
            <Eyebrow className="justify-center">AUTHENTICITY</Eyebrow>
            <Headline as="h1" className="h-display mt-5 text-ice" immediate>
              Check your Reena product.
            </Headline>
            <UrduLine size="lg" className="mt-4 text-steel" >
              اپنی پروڈکٹ کی تصدیق کریں
            </UrduLine>
          </div>

          {/* scanner */}
          <div className="mx-auto mt-12 max-w-[560px]">
            <div className="relative mx-auto mb-8 h-[150px] w-[130px] overflow-hidden rounded-2xl border border-navy-700 bg-navy-900/60">
              <div className="grid h-full place-items-center">
                <ShieldMark size={66} />
              </div>
              {scanning && (
                <div
                  ref={scanRef}
                  className="pointer-events-none absolute inset-x-0 top-0 h-6"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(110,139,255,.75), transparent)",
                  }}
                />
              )}
              {scanning && (
                <span
                  ref={digits}
                  className="absolute inset-x-0 bottom-2 text-center font-mono text-[9px] tracking-widest text-blue-glow/70"
                >
                  000000000000
                </span>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(serial);
              }}
            >
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <IconSearch
                    width={18}
                    height={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel/60"
                  />
                  <input
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="RN-26-005812"
                    aria-label="Serial number"
                    className="h-[56px] w-full rounded-full border border-navy-700 bg-navy-900/70 pl-11 pr-4 font-mono text-[15px] uppercase tracking-wider text-ice placeholder:normal-case placeholder:tracking-normal placeholder:text-steel/45 focus:border-blue-glow focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={scanning}
                  className="h-[56px] shrink-0 rounded-full bg-reena-red px-9 text-[15px] font-medium text-white transition-colors hover:bg-red-bright disabled:opacity-60"
                >
                  {scanning ? "Checking…" : "Check"}
                </button>
              </div>
            </form>

            {/* result */}
            {result && (
              <div
                className="mt-7 overflow-hidden rounded-[22px] border p-6"
                style={{
                  borderColor: result.ok ? "rgba(43,208,122,.4)" : "rgba(255,176,32,.42)",
                  background: result.ok ? "rgba(43,208,122,.07)" : "rgba(255,176,32,.07)",
                  animation: prefersReduced()
                    ? undefined
                    : "result-in .5s cubic-bezier(.2,.9,.3,1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
                    style={{
                      background: result.ok ? "rgba(43,208,122,.16)" : "rgba(255,176,32,.16)",
                      color: result.ok ? "var(--color-safe)" : "var(--color-warn)",
                    }}
                  >
                    {result.ok ? (
                      <IconCheck width={22} height={22} />
                    ) : (
                      <IconAlert width={22} height={22} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="text-[19px] font-semibold"
                      style={{ color: result.ok ? "var(--color-safe)" : "var(--color-warn)" }}
                    >
                      {result.ok ? "Genuine Reena product" : "Serial not found"}
                    </h2>
                    <p className="mt-0.5 font-mono text-[13px] text-steel">{result.serial}</p>

                    {result.ok ? (
                      <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-navy-700/60 pt-5 sm:grid-cols-3">
                        {[
                          ["Model", "RS-5000"],
                          ["Manufactured", "2026"],
                          ["Warranty", "Active (demo)"],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="mono-label text-[9px] text-steel">{k}</dt>
                            <dd className="mt-1 font-mono text-[15px] text-ice">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-steel">
                          We couldn&rsquo;t match that serial. Check the label again, or
                          send us a photo of it.
                        </p>
                        <Btn
                          href={wa(waText.genuine)}
                          tone="navy"
                          size="sm"
                          className="mt-4"
                          external
                        >
                          <IconWhatsApp width={15} height={15} />
                          Ask Reena on WhatsApp
                        </Btn>
                      </>
                    )}

                    <div className="mt-5">
                      <SampleChip
                        tone="dark"
                        label="Demo result · real serial check needs Reena's serial system"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes result-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
      </section>

      {/* how to find it */}
      <section className="sec bg-paper text-ink">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto w-[min(72%,280px)]">
              <ProductMock
                variant="stabilizer"
                model="RS-5000"
                highlightSerial
                live={false}
                className="w-full drop-shadow-[0_26px_50px_rgba(11,17,36,.28)]"
              />
              <span className="mono-label absolute bottom-[14%] right-[-6%] rounded-full bg-reena-red px-2.5 py-1 text-[9px] text-white shadow-lg">
                Serial here
              </span>
            </div>

            <div>
              <Eyebrow tone="light">HOW TO FIND YOUR SERIAL NUMBER</Eyebrow>
              <Headline as="h2" className="h2 mt-5 text-ink">
                It&rsquo;s on the label.
              </Headline>
              <ol className="mt-10 space-y-6">
                {steps.map((s, i) => (
                  <Reveal as="li" key={s.n} delay={i * 0.08} className="flex gap-5">
                    <span className="font-display text-[26px] font-extrabold leading-none text-reena-red/35">
                      {s.n}
                    </span>
                    <span>
                      <span className="block text-[16.5px] font-semibold text-ink">
                        {s.title}
                      </span>
                      <span className="mt-1 block max-w-[46ch] text-[14.5px] leading-relaxed text-slate">
                        {s.line}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
