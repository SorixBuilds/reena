"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

export default function SmoothScroll() {
  /**
   * Reveal animations hide their content until the trigger fires, so a stale
   * trigger position means a blank section. Images and fonts both settle after
   * first paint, so recompute once each has landed.
   */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [
      window.setTimeout(refresh, 400),
      window.setTimeout(refresh, 1600),
    ];
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", refresh);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (prefersReduced()) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let ticker: ((t: number) => void) | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const l = new Lenis({
        duration: 1.08,
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
      });
      lenis = l;
      l.on("scroll", ScrollTrigger.update);
      ticker = (t: number) => l.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      if (ticker) gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  }, []);

  return null;
}
