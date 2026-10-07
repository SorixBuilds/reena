"use client";

import Crest from "../Crest";
import { Btn, Headline, Reveal, UrduLine } from "../UI";
import { IconPhone, IconWhatsApp } from "../Icons";
import { useLang } from "../Providers";
import { site, wa, waText } from "@/config/site";

export default function FinalCta() {
  const { t } = useLang();

  return (
    <section
      id="final-cta"
      className="noise relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #C8232B 0%, #8E1A22 45%, #0A1330 100%)",
      }}
      aria-labelledby="cta-h2"
    >
      {/* shield watermark */}
      <div
        className="pointer-events-none absolute -right-[6%] top-1/2 -translate-y-1/2 text-white/[.07] md:right-[4%]"
        aria-hidden="true"
      >
        <Crest size={520} muted className="w-[min(60vw,520px)]" />
      </div>

      <div className="shell relative py-24 md:py-32">
        <div className="max-w-[640px]">
          <Headline as="h2" className="h2 text-ice">
            {t("s12.h2")}
          </Headline>
          <UrduLine size="lg" className="mt-4 text-ice/85">
            رینا سے بات کریں
          </UrduLine>
          <Reveal>
            <p className="body-lg mt-5 max-w-[42ch] text-ice/80">
              Dealer, installer or home user, we reply on WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Btn href={wa(waText.general)} tone="white" size="lg" magnetic external>
              <IconWhatsApp width={19} height={19} />
              WhatsApp: {site.whatsappDisplay}
            </Btn>
            <Btn href={`tel:${site.phoneE164}`} tone="outline" size="lg" magnetic>
              <IconPhone width={19} height={19} />
              Call: {site.phoneDisplay}
            </Btn>
          </Reveal>

          <p className="mono-label mt-8 text-[10px] text-ice/55">
            {site.shop} · {site.address}
          </p>
        </div>
      </div>
    </section>
  );
}
