"use client";

import { useLang } from "./Providers";

export default function LangToggle({
  onLight = false,
  className = "",
}: {
  onLight?: boolean;
  className?: string;
}) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`flex h-10 items-center rounded-full border p-0.5 ${className}`}
      style={{
        borderColor: onLight ? "var(--color-line)" : "rgba(255,255,255,.2)",
        background: onLight ? "var(--color-mist)" : "rgba(255,255,255,.06)",
      }}
      role="group"
      aria-label="Language"
    >
      {(["en", "ur"] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            lang={l === "ur" ? "ur" : undefined}
            className="relative grid h-9 min-w-[42px] place-items-center rounded-full px-2.5 text-[13px] font-medium transition-colors"
            style={{
              background: active ? "var(--color-reena-red)" : "transparent",
              color: active
                ? "#fff"
                : onLight
                ? "var(--color-slate)"
                : "rgba(242,245,255,.72)",
              fontFamily: l === "ur" ? "var(--font-urdu), serif" : undefined,
              lineHeight: l === "ur" ? 1.9 : undefined,
              paddingBottom: l === "ur" ? 4 : undefined,
            }}
          >
            {l === "en" ? "EN" : "اردو"}
          </button>
        );
      })}
    </div>
  );
}
