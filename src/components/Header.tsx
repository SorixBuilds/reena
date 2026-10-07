"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ShieldMark from "./ShieldMark";
import MobileMenu from "./MobileMenu";
import LangToggle from "./LangToggle";
import { IconMenu, IconWhatsApp } from "./Icons";
import { useLang } from "./Providers";
import { wa, waText } from "@/config/site";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

const LIGHT_PAGES = ["/products", "/contact"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname() || "/";
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  // product detail + products index are light-topped; home/dealers/genuine are dark
  const lightTop = LIGHT_PAGES.some((p) => path.startsWith(p)) && path !== "/products/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const keyline = root.current?.querySelector<SVGPathElement>(".js-shield-keyline");
      const letters = root.current?.querySelectorAll<SVGGElement>(".js-shield-letter path");
      if (keyline) {
        const len = keyline.getTotalLength();
        gsap.fromTo(
          keyline,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", delay: 0.15 }
        );
      }
      if (letters?.length) {
        gsap.fromTo(
          letters,
          { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, delay: 0.35 }
        );
      }
      gsap.fromTo(
        ".js-header-item",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.2 }
      );
    },
    { scope: root }
  );

  const nav = [
    { href: "/products/", label: t("nav.products") },
    { href: "/products/?cat=inverters", label: t("nav.solar") },
    { href: "/dealers/", label: t("nav.dealers") },
    { href: "/genuine/", label: t("nav.genuine") },
    { href: "/contact/", label: t("nav.contact") },
  ];

  const solid = scrolled || lightTop;
  const onLight = lightTop && !scrolled;

  return (
    <>
      <header
        ref={root}
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500"
        style={{
          backgroundColor: scrolled
            ? "rgba(5,10,26,.72)"
            : onLight
            ? "rgba(255,255,255,.9)"
            : "transparent",
          backdropFilter: solid ? "blur(14px)" : undefined,
          WebkitBackdropFilter: solid ? "blur(14px)" : undefined,
        }}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
          <Link
            href="/"
            className="js-header-item flex shrink-0 items-center gap-2.5"
            aria-label="Reena home"
          >
            <ShieldMark size={30} animated />
            <span
              className="font-display text-[19px] font-extrabold leading-none md:text-[21px]"
              style={{
                letterSpacing: "0.08em",
                color: onLight ? "var(--color-ink)" : "#fff",
              }}
            >
              REENA
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => {
              const active = path === n.href.split("?")[0];
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className="js-header-item group relative px-3.5 py-2 text-[14.5px] font-medium transition-colors"
                  style={{ color: onLight ? "var(--color-slate)" : "rgba(242,245,255,.82)" }}
                >
                  {n.label}
                  <span
                    className="sig-line absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ transform: active ? "scaleX(1)" : undefined }}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <LangToggle onLight={onLight} className="js-header-item" />
            <a
              href={wa(waText.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="js-header-item hidden min-h-[44px] items-center gap-2 rounded-full bg-reena-red px-5 text-[14px] font-medium text-white shadow-[0_8px_26px_-10px_rgba(200,35,43,.9)] transition-colors hover:bg-red-bright lg:inline-flex"
            >
              <IconWhatsApp width={17} height={17} />
              WhatsApp
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="js-header-item grid h-11 w-11 place-items-center rounded-full border transition-colors lg:hidden"
              style={{
                borderColor: onLight ? "var(--color-line)" : "rgba(255,255,255,.22)",
                color: onLight ? "var(--color-ink)" : "#fff",
              }}
            >
              <IconMenu width={21} height={21} />
            </button>
          </div>
        </div>
        <div
          className="sig-line h-px w-full transition-opacity duration-500"
          style={{ opacity: solid ? 0.85 : 0 }}
        />
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} nav={nav} />
    </>
  );
}
