"use client";

import { Eyebrow, Headline, Reveal } from "../UI";

const faqs = [
  {
    q: "Which stabilizer do I need for a 1.5-ton AC?",
    a: "It depends on the AC's starting load and your area's lowest voltage. Tell us your appliances on WhatsApp and we'll suggest the right model.",
  },
  {
    q: "Do you sell directly or only through dealers?",
    a: "Mostly through dealers across Pakistan. Customers near Ghotki can also contact us directly.",
  },
  {
    q: "How do I become a Reena dealer?",
    a: "Send us your shop name and city on WhatsApp, or fill in the dealer form. Our team will contact you.",
  },
  {
    q: "Where can I get warranty service?",
    a: "Contact your dealer or message us on WhatsApp with your product's serial number.",
  },
];

export default function FaqList() {
  return (
    <section className="sec bg-paper text-ink" aria-labelledby="faq-h2">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow tone="light">QUESTIONS</Eyebrow>
            <Headline as="h2" className="h2 mt-5 text-ink">
              Good to know.
            </Headline>
          </div>

          <div className="border-t border-line">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group border-b border-line">
                  <summary className="flex items-start justify-between gap-6 py-6 text-left">
                    <span className="text-[17px] font-medium leading-snug text-ink md:text-[19px]">
                      {f.q}
                    </span>
                    <span className="relative mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-colors group-open:border-reena-red group-open:bg-reena-red group-open:text-white">
                      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                      <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-[58ch] pb-6 pr-12 text-[15.5px] leading-relaxed text-slate">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
