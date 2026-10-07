"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Headline, Pic, Reveal, UrduLine } from "../UI";
import { IconSearch, IconShieldCheck } from "../Icons";
import { useLang } from "../Providers";
import { prefersReduced } from "@/lib/gsap";

export default function GenuineTeaser() {
  const [serial, setSerial] = useState("");
  const router = useRouter();
  const { t } = useLang();

  return (
    <section className="sec bg-mist text-ink" aria-labelledby="genuine-h2">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[26px] bg-night">
          <div className="absolute inset-0">
            <Pic
              name="genuine-pcb"
              alt=""
              position="center"
              sizes="100vw"
              className="h-full w-full opacity-30"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(110deg, rgba(5,10,26,.95) 0%, rgba(5,10,26,.8) 48%, rgba(10,19,48,.6) 100%)",
              }}
            />
            {!prefersReduced() && (
              <div className="absolute inset-0 hidden overflow-hidden md:block">
                <div
                  className="scan-bar h-[90px] w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(110,139,255,.22) 45%, rgba(110,139,255,.4) 50%, rgba(110,139,255,.22) 55%, transparent)",
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative grid gap-8 p-7 md:p-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900/70 px-3 py-1.5 text-[12px] text-steel backdrop-blur-sm">
                <IconShieldCheck width={15} height={15} className="text-red-bright" />
                Genuine check
              </span>
              <Headline as="h2" className="h2 text-ice">
                {t("s10.h2")}
              </Headline>
              <UrduLine className="mt-4 text-steel">اصل رینا کی پہچان کریں</UrduLine>
              <Reveal>
                <p className="body-lg mt-5 max-w-[48ch] text-steel">
                  Every Reena product will carry a serial number you can check
                  here, so you and your dealer know it&rsquo;s the real thing.
                </p>
              </Reveal>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/genuine/?s=${encodeURIComponent(serial.trim())}`);
              }}
              className="w-full"
            >
              <label htmlFor="teaser-serial" className="mono-label mb-3 block text-[10.5px] text-steel">
                Serial number
              </label>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <IconSearch
                    width={18}
                    height={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel/60"
                  />
                  <input
                    id="teaser-serial"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Enter serial, e.g. RN-24-005812"
                    className="h-[54px] w-full rounded-full border border-navy-700 bg-night/80 pl-11 pr-4 font-mono text-[14px] text-ice placeholder:text-steel/45 focus:border-blue-glow focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-[54px] shrink-0 rounded-full bg-reena-red px-8 text-[15px] font-medium text-white transition-colors hover:bg-red-bright"
                >
                  Check
                </button>
              </div>
              <p className="mono-label mt-3 text-[9.5px] text-steel/55">
                Demo result · real serial check needs Reena&rsquo;s serial system
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
