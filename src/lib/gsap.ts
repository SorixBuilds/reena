"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out" });
}

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const DESKTOP = "(min-width: 1024px) and (pointer: fine)";
export const MOBILE = "(max-width: 1023px)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

/** split an element's text into line wrappers without the paid SplitText plugin */
export function splitLines(el: HTMLElement) {
  if (el.dataset.split === "1") {
    return Array.from(el.querySelectorAll<HTMLElement>(".js-line-inner"));
  }
  // keep the source text so the split can be redone when the width changes
  if (!el.dataset.sourceText) el.dataset.sourceText = el.textContent || "";
  const text = el.dataset.sourceText;
  const words = text.split(/\s+/).filter(Boolean);
  el.textContent = "";
  // the separating space must be its own text node — a space inside the span
  // would not collapse at a line break and would wrap differently to the final markup
  const probes: HTMLElement[] = words.map((w, i) => {
    const s = document.createElement("span");
    s.textContent = w;
    s.style.display = "inline-block";
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    return s;
  });

  // group words by their offsetTop → visual lines
  const lines: string[][] = [];
  let lastTop: number | null = null;
  probes.forEach((p, i) => {
    const top = Math.round(p.offsetTop);
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1].push(words[i]);
  });

  el.textContent = "";
  const inners: HTMLElement[] = [];
  lines.forEach((words) => {
    const outer = document.createElement("span");
    outer.className = "mask-line";
    const inner = document.createElement("span");
    inner.className = "js-line-inner";
    inner.style.display = "block";
    inner.style.willChange = "transform";
    inner.textContent = words.join(" ");
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  });
  el.dataset.split = "1";
  return inners;
}

/** undo a split so the browser can re-wrap the text at a new width */
export function unsplitLines(el: HTMLElement) {
  if (el.dataset.split !== "1" || !el.dataset.sourceText) return;
  el.textContent = el.dataset.sourceText;
  delete el.dataset.split;
}

/** standard masked line reveal used across the site */
/**
 * Line measurement wants the real font metrics, but a stalled font load must never
 * leave content stuck at opacity 0 — so the wait is capped.
 */
export function onFontsReady(cb: () => void, timeout = 1200) {
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    requestAnimationFrame(cb);
  };
  const timer = window.setTimeout(once, timeout);
  document.fonts?.ready.then(once).catch(once) ?? once();
  return () => window.clearTimeout(timer);
}

/** Arabic-script ranges — splitting these into word spans would break the bidi run */
const RTL_TEXT = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

export function revealLines(
  el: HTMLElement | null,
  opts: { trigger?: Element | null; delay?: number; stagger?: number } = {}
) {
  if (!el) return;
  const text = el.dataset.sourceText ?? el.textContent ?? "";
  const isRtl = RTL_TEXT.test(text) || getComputedStyle(el).direction === "rtl";

  if (prefersReduced() || isRtl) {
    gsap.fromTo(
      el,
      { opacity: 0, y: isRtl && !prefersReduced() ? 18 : 0 },
      {
        opacity: 1,
        y: 0,
        duration: prefersReduced() ? 0.2 : 0.8,
        delay: opts.delay ?? 0,
        scrollTrigger: opts.trigger
          ? { trigger: opts.trigger, start: "top 82%", once: true }
          : undefined,
      }
    );
    return;
  }

  const lines = splitLines(el);
  gsap.fromTo(
    lines,
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: opts.stagger ?? 0.08,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger
        ? { trigger: opts.trigger, start: "top 82%", once: true }
        : undefined,
    }
  );
}

export { gsap, ScrollTrigger, useGSAP };
