"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  gsap,
  useGSAP,
  revealLines,
  splitLines,
  unsplitLines,
  onFontsReady,
  prefersReduced,
  DESKTOP,
} from "@/lib/gsap";

/* ── eyebrow ──────────────────────────────────────────────────── */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`mono-label flex items-center gap-3 ${
        tone === "dark" ? "text-steel" : "text-slate"
      } ${className}`}
    >
      <span className="sig-line inline-block h-px w-8 shrink-0 rounded-full" />
      {children}
    </div>
  );
}

/* ── urdu accent line ─────────────────────────────────────────── */
export function UrduLine({
  children,
  className = "",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const s =
    size === "lg"
      ? "text-[22px] md:text-[30px]"
      : size === "sm"
      ? "text-[16px] md:text-[19px]"
      : "text-[19px] md:text-[24px]";
  // the box hugs its text so the RTL line sits under the heading rather than
  // drifting to the far edge of a wide container
  return (
    <p lang="ur" dir="rtl" className={`font-urdu w-fit max-w-full ${s} ${className}`}>
      {children}
    </p>
  );
}

/* ── headline with masked line reveal ─────────────────────────── */
export function Headline({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
  immediate = false,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const cancelFonts = onFontsReady(() =>
        revealLines(el, { trigger: immediate ? null : el, delay })
      );

      // the split bakes in line breaks, so redo it when the width changes
      let w = window.innerWidth;
      let timer: number;
      const onResize = () => {
        if (window.innerWidth === w) return;
        w = window.innerWidth;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          unsplitLines(el);
          splitLines(el);
        }, 180);
      };
      window.addEventListener("resize", onResize);
      return () => {
        cancelFonts();
        window.removeEventListener("resize", onResize);
        window.clearTimeout(timer);
      };
    },
    { scope: ref }
  );
  // headings carry Urdu when the language toggle is on — give them the right
  // direction, font and leading rather than treating them as Latin display type
  const isRtl = /[؀-ۿﭐ-﷿ﹰ-﻿]/.test(children);

  return (
    <Tag
      key={isRtl ? "ur" : "en"}
      ref={ref as never}
      lang={isRtl ? "ur" : undefined}
      dir={isRtl ? "rtl" : undefined}
      className={className}
      style={
        isRtl
          ? { fontFamily: "var(--font-urdu), serif", lineHeight: 1.8, width: "fit-content" }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

/* ── generic scroll reveal ────────────────────────────────────── */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReduced()) {
        gsap.set(ref.current, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        }
      );
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref as never} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}

/* ── image reveal wrapper ─────────────────────────────────────── */
export function ImageReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      if (prefersReduced() || !inner) return;
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "expo.inOut",
          delay,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }
      );
      gsap.fromTo(
        inner,
        { scale: 1.16 },
        {
          scale: 1,
          duration: 1.3,
          ease: "expo.out",
          delay,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }
      );
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ── count-up number ──────────────────────────────────────────── */
export function CountUp({
  value,
  className = "",
  duration = 1.4,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!m || prefersReduced()) return;
      const [, pre, numStr, post] = m;
      const target = parseFloat(numStr.replace(/,/g, ""));
      const decimals = (numStr.split(".")[1] || "").length;
      const o = { n: 0 };
      el.textContent = pre + (0).toFixed(decimals) + post;
      gsap.to(o, {
        n: target,
        duration,
        ease: "power2.out",
        snap: decimals ? { n: 0.1 } : { n: 1 },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = pre + o.n.toFixed(decimals) + post;
        },
      });
    },
    { scope: ref, dependencies: [value] }
  );
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/* ── chips ────────────────────────────────────────────────────── */
export function SampleChip({
  label = "Sample specs",
  tone = "light",
  className = "",
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={`mono-label inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-center text-[10px] leading-snug sm:text-[10.5px] ${
        tone === "dark"
          ? "border-navy-700 bg-navy-800/70 text-steel"
          : "border-line bg-mist text-slate"
      } ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
      {label}
    </span>
  );
}

/* ── buttons ──────────────────────────────────────────────────── */
type BtnTone = "red" | "glass" | "white" | "outline" | "navy" | "ghost";

const toneClass: Record<BtnTone, string> = {
  red: "bg-reena-red text-white hover:bg-red-bright shadow-[0_10px_34px_-10px_rgba(200,35,43,.85)]",
  glass:
    "bg-white/10 text-ice backdrop-blur-md border border-white/25 hover:bg-white/18",
  white: "bg-white text-ink hover:bg-ice",
  outline: "border border-white/35 text-ice hover:bg-white/10",
  navy: "border border-navy-700 bg-navy-800/60 text-ice hover:bg-navy-700",
  ghost: "border border-line bg-paper text-ink hover:bg-mist",
};

export function Btn({
  children,
  tone = "red",
  href,
  external,
  magnetic = false,
  className = "",
  size = "md",
  ...rest
}: {
  children: ReactNode;
  tone?: BtnTone;
  href?: string;
  external?: boolean;
  magnetic?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
} & Omit<ComponentProps<"button">, "ref">) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!magnetic || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const el = ref.current!;
        const qx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const qy = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          qx((e.clientX - (r.left + r.width / 2)) * 0.3);
          qy((e.clientY - (r.top + r.height / 2)) * 0.4);
        };
        const out = () => {
          qx(0);
          qy(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", out);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", out);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [magnetic] }
  );

  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-[16px]"
      : size === "sm"
      ? "px-4 py-2.5 text-[13px]"
      : "px-6 py-3.5 text-[14.5px]";

  const cls = `group inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-300 active:scale-[.97] ${sizeClass} ${toneClass[tone]} ${className}`;

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel:")) {
      return (
        <a
          ref={ref as never}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={cls}
        >
          {children}
        </a>
      );
    }
    return (
      <Link ref={ref as never} href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref as never} className={cls} {...rest}>
      {children}
    </button>
  );
}

/* ── responsive self-hosted picture ───────────────────────────── */
export function Pic({
  name,
  alt,
  className = "",
  imgClassName = "",
  position = "center",
  priority = false,
  sizes = "100vw",
  portrait = false,
}: {
  name: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  priority?: boolean;
  sizes?: string;
  portrait?: boolean;
}) {
  const widths = [480, 828, 1200, 1920];
  const srcset = (ext: string) =>
    widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture className={className}>
      {portrait && (
        <>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={`/img/${name}-portrait.avif`}
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={`/img/${name}-portrait.webp`}
          />
        </>
      )}
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={`/img/${name}-1200.webp`}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ objectPosition: position }}
      />
    </picture>
  );
}

/* ── hook: has the element entered view ───────────────────────── */
export function useInView<T extends HTMLElement>(margin = "0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

/* ── section divider ──────────────────────────────────────────── */
export function Divider({ className = "" }: { className?: string }) {
  return <div className={`sig-line h-px w-full opacity-60 ${className}`} />;
}
