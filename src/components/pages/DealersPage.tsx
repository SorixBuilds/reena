"use client";

import { useState } from "react";
import DealerMap from "../DealerMap";
import { BenefitCards } from "../home/Dealers";
import { Btn, Eyebrow, Headline, Pic, Reveal, UrduLine } from "../UI";
import { IconArrow, IconWhatsApp } from "../Icons";
import { useLang, useToast } from "../Providers";
import { site, wa } from "@/config/site";
import { categories } from "@/data/categories";

const steps = [
  {
    n: "01",
    title: "Send your details",
    line: "Shop name, city and the products you want to stock.",
  },
  { n: "02", title: "Talk to Reena", line: "We call you to discuss the range and terms." },
  {
    n: "03",
    title: "Start selling",
    line: "Get your first stock directly from the manufacturer.",
  },
];

const field =
  "h-[52px] w-full rounded-xl border border-line bg-paper px-4 text-[15px] text-ink placeholder:text-slate/50 focus:border-reena-red focus:outline-none transition-colors";

export default function DealersPage() {
  const { t } = useLang();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    shop: "",
    city: "",
    phone: "",
    message: "",
  });
  const [picked, setPicked] = useState<string[]>([]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = picked.length ? picked.join(", ") : "All categories";
    const text = `Assalam-o-alaikum, main Reena ka dealer banna chahta hoon. Naam: ${
      form.name || "—"
    }. Dukaan: ${form.shop || "—"}. Shehar: ${form.city || "—"}. Phone: ${
      form.phone || "—"
    }. Products: ${list}.${form.message ? ` ${form.message}` : ""}`;
    window.open(wa(text), "_blank", "noopener,noreferrer");
    toast("WhatsApp khul raha hai — message tayyar hai.");
  };

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-night pt-[84px]">
        <div className="absolute inset-0">
          <Pic
            name="dealer-shop"
            alt=""
            position="center"
            sizes="100vw"
            className="h-full w-full opacity-[.22]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(5,10,26,.96) 0%, rgba(5,10,26,.85) 45%, rgba(5,10,26,.6) 100%)",
            }}
          />
        </div>

        <div className="shell relative grid gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
          <div>
            <Eyebrow>FOR DEALERS</Eyebrow>
            <Headline as="h1" className="h-display mt-5 text-ice" immediate>
              Become a Reena dealer.
            </Headline>
            <UrduLine size="lg" className="mt-4 text-steel">
              رینا ڈیلر بنیں
            </UrduLine>
            <p className="body-lg mt-5 max-w-[42ch] text-steel">
              Stock a full power range from one manufacturer.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Btn href="#dealer-form" tone="red">
                Send your details
                <IconArrow width={17} height={17} className="transition-transform group-hover:translate-x-1" />
              </Btn>
              <Btn
                href={wa("Assalam-o-alaikum, main Reena ka dealer banna chahta hoon.")}
                tone="glass"
                external
              >
                <IconWhatsApp width={17} height={17} />
                WhatsApp
              </Btn>
            </div>
          </div>
          <DealerMap className="mx-auto w-full max-w-[440px]" />
        </div>
      </section>

      {/* benefits */}
      <section className="sec bg-paper text-ink">
        <div className="shell">
          <Eyebrow tone="light">WHY REENA</Eyebrow>
          <Headline as="h2" className="h2 mt-5 max-w-[16ch] text-ink">
            One manufacturer for the whole power chain.
          </Headline>
          <div className="mt-12">
            <BenefitCards tone="light" />
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="sec bg-navy-900">
        <div className="shell">
          <Eyebrow>HOW IT WORKS</Eyebrow>
          <Headline as="h2" className="h2 mt-5 text-ice">
            Three steps.
          </Headline>

          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal
                as="li"
                key={s.n}
                delay={i * 0.1}
                className="relative rounded-[20px] border border-navy-700 bg-navy-800/50 p-7"
              >
                <span className="font-display text-[44px] font-extrabold leading-none text-reena-red/30">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[18px] font-semibold text-ice">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-steel">{s.line}</p>
                {i < steps.length - 1 && (
                  <span className="sig-line absolute -right-2 top-1/2 hidden h-px w-4 md:block" />
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* form */}
      <section id="dealer-form" className="sec scroll-mt-24 bg-mist text-ink">
        <div className="shell">
          <div className="mx-auto max-w-[760px]">
            <div className="text-center">
              <Eyebrow tone="light" className="justify-center">
                DEALER ENQUIRY
              </Eyebrow>
              <Headline as="h2" className="h2 mt-5 text-ink">
                Tell us about your shop.
              </Headline>
              <p className="body-lg mt-4 text-slate">
                We&rsquo;ll send it straight to Reena on WhatsApp.
              </p>
            </div>

            <form
              onSubmit={submit}
              className="mt-10 rounded-[24px] border border-line bg-paper p-6 md:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mono-label mb-2 block text-[10px] text-slate">Your name</span>
                  <input className={field} value={form.name} onChange={set("name")} placeholder="Rajesh Kumar" />
                </label>
                <label className="block">
                  <span className="mono-label mb-2 block text-[10px] text-slate">Shop name</span>
                  <input className={field} value={form.shop} onChange={set("shop")} placeholder="Jan Electrical" />
                </label>
                <label className="block">
                  <span className="mono-label mb-2 block text-[10px] text-slate">City</span>
                  <input className={field} value={form.city} onChange={set("city")} placeholder="Ghotki" />
                </label>
                <label className="block">
                  <span className="mono-label mb-2 block text-[10px] text-slate">Phone</span>
                  <input
                    className={field}
                    value={form.phone}
                    onChange={set("phone")}
                    type="tel"
                    inputMode="tel"
                    placeholder="0300-0000000"
                  />
                </label>
              </div>

              <fieldset className="mt-6">
                <legend className="mono-label mb-3 text-[10px] text-slate">
                  Products you want to stock
                </legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = picked.includes(c.title);
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() =>
                          setPicked((p) =>
                            on ? p.filter((x) => x !== c.title) : [...p, c.title]
                          )
                        }
                        aria-pressed={on}
                        className="min-h-[44px] rounded-full border px-4 text-[14px] transition-colors"
                        style={{
                          borderColor: on ? "var(--color-reena-red)" : "var(--color-line)",
                          background: on ? "var(--color-reena-red)" : "var(--color-paper)",
                          color: on ? "#fff" : "var(--color-slate)",
                        }}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-6 block">
                <span className="mono-label mb-2 block text-[10px] text-slate">
                  Message (optional)
                </span>
                <textarea
                  className={`${field} h-auto min-h-[110px] resize-y py-3.5`}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Anything you'd like to tell us"
                />
              </label>

              <Btn tone="red" size="lg" className="mt-7 w-full">
                <IconWhatsApp width={19} height={19} />
                Send on WhatsApp
              </Btn>
              <p className="mono-label mt-4 text-center text-[9.5px] text-slate/60">
                Demo form · it opens WhatsApp with your details filled in
              </p>
            </form>

            <p className="mt-8 text-center text-[14px] text-slate">
              Prefer to call? {site.phoneDisplay} · {site.shop}, {site.address}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
