"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Eyebrow, Headline, Pic, UrduLine } from "../UI";
import { useLang } from "../Providers";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

type Node = {
  id: string;
  label: string;
  sub: string;
  reena: boolean;
  cat?: string;
  icon: "panel" | "mppt" | "battery" | "inverter" | "stabilizer" | "socket";
};

const nodes: Node[] = [
  { id: "sun", label: "Solar panels", sub: "Not Reena", reena: false, icon: "panel" },
  { id: "mppt", label: "MPPT charger", sub: "RSC-40 · RSC-60", reena: true, cat: "mppt", icon: "mppt" },
  { id: "bat", label: "Battery", sub: "Not Reena", reena: false, icon: "battery" },
  { id: "inv", label: "Solar inverter", sub: "RPV-3.6K · RPV-6K", reena: true, cat: "inverters", icon: "inverter" },
  { id: "stab", label: "Stabilizer", sub: "RS-1000 → RS-10000", reena: true, cat: "stabilizers", icon: "stabilizer" },
  { id: "home", label: "Home appliances", sub: "Protected", reena: false, icon: "socket" },
];

function NodeIcon({ type }: { type: Node["icon"] }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "panel":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <path d="M3 15h18l-2-9H5Z" />
          <path d="M8.2 6 7 15M15.8 6 17 15M4 10.5h16" />
          <path d="M12 15v5M9 20h6" />
        </svg>
      );
    case "mppt":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <path d="M6 3.5v2.5M10 3.5v2.5M14 3.5v2.5M18 3.5v2.5" />
          <path d="M7 12h3l1.5-2.5L13 14l1.5-2h2.5" />
        </svg>
      );
    case "battery":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <rect x="2.5" y="7" width="17" height="10" rx="2" />
          <path d="M20.5 10.5v3" />
          <path d="M6 10v4M10 10v4M14 10v4" />
        </svg>
      );
    case "inverter":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <rect x="7" y="6.5" width="10" height="6" rx="1" />
          <path d="M8 17h2M14 17h2" />
        </svg>
      );
    case "stabilizer":
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
          <path d="M7.5 8.5h9M7.5 12h9" />
          <circle cx="9" cy="16.5" r="1" />
          <circle cx="12" cy="16.5" r="1" />
          <circle cx="15" cy="16.5" r="1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <circle cx="9" cy="10" r="1.2" />
          <circle cx="15" cy="10" r="1.2" />
          <path d="M8.5 15.5h7" />
        </svg>
      );
  }
}

export default function SunToSocket() {
  const root = useRef<HTMLElement>(null);
  const router = useRouter();
  const { t } = useLang();
  const [vertical, setVertical] = useState(true);

  useEffect(() => {
    const check = () => setVertical(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useGSAP(
    () => {
      if (prefersReduced()) {
        gsap.set(".js-flow-node, .js-flow-path", { opacity: 1 });
        return;
      }
      const paths = gsap.utils.toArray<SVGPathElement>(".js-flow-path", root.current);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".js-flow", start: "top 76%", once: true },
      });
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });
      tl.to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.12, ease: "power2.inOut" })
        .fromTo(
          ".js-flow-node",
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 0.6, stagger: 0.09, ease: "back.out(1.6)" },
          0.2
        )
        .fromTo(".js-flow-dash", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3");
    },
    { scope: root, dependencies: [vertical] }
  );

  return (
    <section ref={root} className="sec relative overflow-hidden bg-night" aria-labelledby="flow-h2">
      <div className="absolute inset-0 -z-10">
        <Pic
          name="bg-tower-night"
          alt=""
          position="center"
          sizes="100vw"
          className="h-full w-full opacity-25"
        />
        <div className="absolute inset-0 bg-night/82" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-night) 0%, rgba(5,10,26,.6) 30%, rgba(5,10,26,.75) 70%, var(--color-night) 100%)",
          }}
        />
      </div>

      <div className="shell relative">
        <div className="max-w-[720px]">
          <Eyebrow>ONE BRAND, WHOLE SYSTEM</Eyebrow>
          <Headline as="h2" className="h2 mt-5 text-ice">
            {t("s7.h2")}
          </Headline>
          <UrduLine className="mt-4 text-steel">سورج سے ساکٹ تک، سب رینا</UrduLine>
          <p className="body-lg mt-5 max-w-[56ch] text-steel">
            Reena makes the charger, the inverter, the stabilizer and the wire that
            connects them. Dealers stock one brand for the whole job.
          </p>
        </div>

        {/* ── the flow ── */}
        <div className="js-flow mt-16">
          {/* desktop: horizontal */}
          <div className="relative hidden lg:block">
            <svg
              viewBox="0 0 1200 120"
              className="absolute inset-x-0 top-[46px] h-[120px] w-full"
              aria-hidden="true"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="wire-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#C8232B" />
                  <stop offset="1" stopColor="#29438E" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((i) => {
                const x1 = 100 + i * 200 + 56;
                const x2 = 100 + (i + 1) * 200 - 56;
                return (
                  <g key={i}>
                    <path
                      className="js-flow-path"
                      d={`M${x1} 14 H${x2}`}
                      stroke="url(#wire-grad)"
                      strokeWidth="2.5"
                      opacity="0"
                    />
                    <path
                      className="js-flow-dash current-dash"
                      d={`M${x1} 14 H${x2}`}
                      stroke="#6E8BFF"
                      strokeWidth="4"
                      opacity="0"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="relative grid grid-cols-6 gap-2">
              {nodes.map((n) => (
                <NodeCard key={n.id} n={n} router={router} />
              ))}
            </div>
          </div>

          {/* mobile: vertical */}
          <div className="relative lg:hidden">
            <svg
              className="absolute left-[38px] top-0 h-full w-[4px]"
              viewBox="0 0 4 1000"
              preserveAspectRatio="none"
              aria-hidden="true"
              fill="none"
            >
              <defs>
                <linearGradient id="wire-grad-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#C8232B" />
                  <stop offset="1" stopColor="#29438E" />
                </linearGradient>
              </defs>
              <path
                className="js-flow-path"
                d="M2 10 V 990"
                stroke="url(#wire-grad-v)"
                strokeWidth="2.5"
                opacity="0"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="js-flow-dash current-dash"
                d="M2 10 V 990"
                stroke="#6E8BFF"
                strokeWidth="4"
                opacity="0"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="relative space-y-3">
              {nodes.map((n) => (
                <NodeRow key={n.id} n={n} router={router} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeCard({ n, router }: { n: Node; router: ReturnType<typeof useRouter> }) {
  const Tag = n.cat ? "button" : "div";
  return (
    <Tag
      onClick={n.cat ? () => router.push(`/products/?cat=${n.cat}`) : undefined}
      className={`js-flow-node group relative flex flex-col items-center rounded-2xl border p-4 text-center transition-colors ${
        n.reena
          ? "border-reena-red/45 bg-navy-900/80 hover:border-reena-red"
          : "border-navy-700/70 bg-navy-900/40"
      }`}
      style={{ opacity: 0, backdropFilter: "blur(6px)" }}
    >
      {n.reena && (
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{ boxShadow: "0 0 44px -10px rgba(200,35,43,.55) inset" }}
        />
      )}
      <span
        className={`relative grid h-[52px] w-[52px] place-items-center rounded-full border transition-transform duration-400 group-hover:scale-110 ${
          n.reena
            ? "border-reena-red/60 bg-reena-red/12 text-red-bright"
            : "border-navy-700 bg-navy-800/60 text-steel"
        }`}
      >
        <NodeIcon type={n.icon} />
      </span>
      <span className="mt-3 text-[14px] font-medium leading-tight text-ice">{n.label}</span>
      <span className="mono-label mt-1.5 text-[9px] leading-tight text-steel/80">{n.sub}</span>
      {n.reena && (
        <span className="mono-label mt-2 rounded-full bg-reena-red px-2 py-0.5 text-[8.5px] text-white">
          REENA
        </span>
      )}
    </Tag>
  );
}

function NodeRow({ n, router }: { n: Node; router: ReturnType<typeof useRouter> }) {
  const Tag = n.cat ? "button" : "div";
  return (
    <Tag
      onClick={n.cat ? () => router.push(`/products/?cat=${n.cat}`) : undefined}
      className={`js-flow-node relative flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left ${
        n.reena ? "border-reena-red/45 bg-navy-900/85" : "border-navy-700/70 bg-navy-900/50"
      }`}
      style={{ opacity: 0, backdropFilter: "blur(6px)" }}
    >
      <span
        className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border ${
          n.reena
            ? "border-reena-red/60 bg-reena-red/12 text-red-bright"
            : "border-navy-700 bg-navy-800/60 text-steel"
        }`}
      >
        <NodeIcon type={n.icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ice">{n.label}</span>
        <span className="mono-label block text-[9.5px] text-steel/80">{n.sub}</span>
      </span>
      {n.reena && (
        <span className="mono-label shrink-0 rounded-full bg-reena-red px-2 py-1 text-[8.5px] text-white">
          REENA
        </span>
      )}
    </Tag>
  );
}
