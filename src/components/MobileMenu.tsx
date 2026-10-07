"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import ShieldMark from "./ShieldMark";
import ReenaWave from "./ReenaWave";
import { IconClose, IconPhone, IconWhatsApp, IconPin } from "./Icons";
import { useLang } from "./Providers";
import { site, wa, waText } from "@/config/site";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

export default function MobileMenu({
  open,
  onClose,
  nav,
}: {
  open: boolean;
  onClose: () => void;
  nav: { href: string; label: string }[];
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled])'
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const id = setTimeout(
      () => panel.current?.querySelector<HTMLElement>("button")?.focus(),
      80
    );
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open || !panel.current) return;
      if (prefersReduced()) {
        gsap.set(".js-menu-link, .js-menu-foot", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".js-menu-link",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, delay: 0.12, ease: "expo.out" }
      );
      gsap.fromTo(
        ".js-menu-foot",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3 }
      );
    },
    { scope: panel, dependencies: [open] }
  );

  return (
    <div
      className="fixed inset-0 z-[70] lg:hidden"
      style={{
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
        transition: "visibility .45s",
      }}
      aria-hidden={!open}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="noise relative flex h-full flex-col overflow-y-auto bg-night"
        style={{
          clipPath: open ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path .62s cubic-bezier(.76,0,.24,1)",
        }}
      >
        <div className="shell flex h-[72px] shrink-0 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldMark size={28} />
            <span
              className="font-display text-[19px] font-extrabold text-white"
              style={{ letterSpacing: "0.08em" }}
            >
              REENA
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-ice"
          >
            <IconClose width={21} height={21} />
          </button>
        </div>

        <nav className="shell flex flex-1 flex-col justify-center gap-1 py-8">
          {nav.map((n, i) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={onClose}
              className="js-menu-link group flex items-baseline gap-4 py-2.5"
              style={{ opacity: 0 }}
            >
              <span className="font-mono text-[11px] text-steel/60">
                0{i + 1}
              </span>
              <span className="font-display text-[clamp(32px,10vw,44px)] font-extrabold leading-[1.05] text-ice transition-colors group-hover:text-red-bright">
                {n.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="js-menu-foot shell shrink-0 pb-[calc(24px+env(safe-area-inset-bottom))]" style={{ opacity: 0 }}>
          <div className="pointer-events-none mb-6 opacity-60">
            <ReenaWave height={64} amplitude={14} cycles={2.4} strokeWidth={1.5} />
          </div>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 flex items-start gap-3 text-[14px] leading-relaxed text-steel"
          >
            <IconPin width={18} height={18} className="mt-0.5 shrink-0 text-reena-red" />
            <span>
              <span className="text-ice">{site.shop}</span>
              <br />
              {site.address}
            </span>
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={wa(waText.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-reena-red text-[15px] font-medium text-white"
            >
              <IconWhatsApp width={18} height={18} />
              WhatsApp
            </a>
            <a
              href={`tel:${site.phoneE164}`}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] font-medium text-ice"
            >
              <IconPhone width={18} height={18} />
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
