"use client";

import Link from "next/link";
import ShieldMark from "./ShieldMark";
import ReenaWave from "./ReenaWave";
import { IconArrowUpRight, IconPin } from "./Icons";
import { useLang } from "./Providers";
import { site } from "@/config/site";
import { categories } from "@/data/categories";

export default function Footer() {
  const { isUr, t } = useLang();

  return (
    <footer className="relative overflow-hidden bg-night pt-px">
      <div className="pointer-events-none absolute inset-x-0 top-0 opacity-50">
        <ReenaWave height={90} amplitude={16} cycles={3.5} strokeWidth={1.5} opacity={0.5} />
      </div>

      <div className="shell relative pb-10 pt-24">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <ShieldMark size={38} />
              <div>
                <div
                  className="font-display text-[22px] font-extrabold leading-none text-white"
                  style={{ letterSpacing: "0.08em" }}
                >
                  REENA
                </div>
                <div className="mono-label mt-1.5 text-[10px] text-steel">
                  World Class
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-[34ch] text-[14.5px] leading-relaxed text-steel">
              Voltage stabilizers, solar inverters, MPPT chargers and electrical
              wires, manufactured by Reena.
            </p>
          </div>

          <div>
            <h4 className="mono-label mb-4 text-[11px] text-steel/70">Products</h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.key}>
                  <Link
                    href={`/products/?cat=${c.key}`}
                    className="text-[14.5px] text-ice/80 transition-colors hover:text-red-bright"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mono-label mb-4 text-[11px] text-steel/70">Company</h4>
            <ul className="space-y-2.5">
              {[
                ["/dealers/", t("nav.dealers")],
                ["/genuine/", t("nav.genuine")],
                ["/contact/", t("nav.contact")],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[14.5px] text-ice/80 transition-colors hover:text-red-bright"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mono-label mb-4 text-[11px] text-steel/70">Visit</h4>
            <p className="text-[14.5px] leading-relaxed text-ice/80">
              {site.shop}
              <br />
              <span className="text-steel">{site.address}</span>
            </p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-red-bright transition-opacity hover:opacity-80"
            >
              <IconPin width={16} height={16} />
              Open in Google Maps
              <IconArrowUpRight width={14} height={14} />
            </a>
            <div className="mt-5 space-y-1 font-mono text-[13px] text-steel">
              <div>WhatsApp · {site.whatsappDisplay}</div>
              <div>Phone · {site.phoneDisplay}</div>
            </div>
          </div>
        </div>

        {isUr && (
          <p
            lang="ur"
            dir="rtl"
            className="font-urdu mt-10 text-right text-[16px] text-steel"
          >
            {t("footer.urduNote")}
          </p>
        )}

        <div className="sig-line mt-12 h-px w-full opacity-40" />

        <div className="mt-6 flex flex-col gap-3 text-[12.5px] text-steel md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Reena · Registered Trademark No. {site.trademarkNo} · Ghotki,
            Sindh
          </p>
          <p className="mono-label text-[10px] text-steel/60">
            Design preview by {site.demoBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
