"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang, StringKey } from "@/data/i18n";
import { t as translate } from "@/data/i18n";
import { DEMO_TOAST } from "@/config/site";

/* ── language ─────────────────────────────────────────────────── */
type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
  isUr: boolean;
};
const LangContext = createContext<LangCtx | null>(null);

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang outside provider");
  return ctx;
}

/* ── toast ────────────────────────────────────────────────────── */
type ToastCtx = { toast: (msg?: string) => void };
const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

export default function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<{ id: number; text: string }[]>([]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.lang = l;
      try {
        localStorage.setItem("reena-lang", l);
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("reena-lang") as Lang | null;
      if (saved === "ur") setLang("ur");
    } catch {}
  }, [setLang]);

  const toast = useCallback((text: string = DEMO_TOAST) => {
    const id = Date.now() + Math.random();
    setMsgs((m) => [...m.slice(-2), { id, text }]);
    setTimeout(() => setMsgs((m) => m.filter((x) => x.id !== id)), 4200);
  }, []);

  const langValue = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (k: StringKey) => translate(k, lang),
      isUr: lang === "ur",
    }),
    [lang, setLang]
  );

  return (
    <LangContext.Provider value={langValue}>
      <ToastContext.Provider value={{ toast }}>
        {children}
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 px-4 pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-8"
          role="status"
          aria-live="polite"
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              className="pointer-events-auto max-w-[520px] rounded-full border border-navy-700 bg-navy-900/95 px-5 py-3 text-center text-[14px] text-ice shadow-[0_18px_50px_-12px_rgba(0,0,0,.8)] backdrop-blur-md"
              style={{ animation: "toast-in .32s cubic-bezier(.2,.9,.3,1)" }}
            >
              <span className="mr-2 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-reena-red align-middle" />
              {m.text}
            </div>
          ))}
        </div>
        <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}`}</style>
      </ToastContext.Provider>
    </LangContext.Provider>
  );
}
