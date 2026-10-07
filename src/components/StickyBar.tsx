"use client";

import { useEffect, useState } from "react";
import { IconPhone, IconWhatsApp } from "./Icons";
import { useLang } from "./Providers";
import { site, wa, waText } from "@/config/site";

export default function StickyBar() {
  const [show, setShow] = useState(false);
  const { t, isUr } = useLang();

  useEffect(() => {
    const check = () => {
      const past = window.scrollY > window.innerHeight * 0.6;
      const cta = document.getElementById("final-cta");
      let ctaVisible = false;
      if (cta) {
        const r = cta.getBoundingClientRect();
        ctaVisible = r.top < window.innerHeight - 40 && r.bottom > 0;
      }
      setShow(past && !ctaVisible);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-navy-700/70 bg-night/92 px-3 pb-[env(safe-area-inset-bottom)] pt-2.5 backdrop-blur-xl md:hidden"
      style={{
        transform: show ? "translateY(0)" : "translateY(110%)",
        transition: "transform .45s cubic-bezier(.3,.9,.3,1)",
      }}
      aria-hidden={!show}
    >
      <div className="grid grid-cols-2 gap-2.5 pb-2.5">
        <a
          href={wa(waText.general)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-reena-red text-[15px] font-medium text-white"
          style={{ fontFamily: isUr ? "var(--font-urdu), serif" : undefined }}
        >
          <IconWhatsApp width={18} height={18} />
          {t("cta.whatsapp")}
        </a>
        <a
          href={`tel:${site.phoneE164}`}
          tabIndex={show ? 0 : -1}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-navy-700 bg-navy-800/60 text-[15px] font-medium text-ice"
          style={{ fontFamily: isUr ? "var(--font-urdu), serif" : undefined }}
        >
          <IconPhone width={18} height={18} />
          {t("cta.call")}
        </a>
      </div>
    </div>
  );
}
