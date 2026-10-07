"use client";

import Link from "next/link";
import ProductMock, { mockForCategory } from "./ProductMock";
import { IconArrow } from "./Icons";
import type { Product } from "@/data/products";

export default function ProductCard({
  p,
  highlighted = false,
}: {
  p: Product;
  highlighted?: boolean;
}) {
  const variant = mockForCategory(p.category);
  return (
    <Link
      href={`/products/${p.slug}/`}
      className="sig-border group relative flex flex-col overflow-hidden rounded-[20px] border bg-mist transition-shadow duration-400 hover:shadow-[0_24px_60px_-28px_rgba(11,17,36,.45)]"
      style={{
        borderColor: highlighted ? "var(--color-reena-red)" : "var(--color-line)",
        boxShadow: highlighted
          ? "0 0 0 3px rgba(200,35,43,.16), 0 24px 60px -30px rgba(200,35,43,.5)"
          : undefined,
      }}
    >
      {highlighted && (
        <span className="mono-label absolute left-3 top-3 z-10 rounded-full bg-reena-red px-2.5 py-1 text-[9px] text-white">
          Suggested
        </span>
      )}
      <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-gradient-to-b from-paper to-mist p-5">
        <ProductMock
          variant={variant}
          model={p.model}
          live={false}
          className={`transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04] ${
            variant === "mppt" || variant === "coil" ? "h-full w-auto" : "h-full w-auto"
          } drop-shadow-[0_16px_28px_rgba(11,17,36,.22)]`}
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[12px] tracking-[0.08em] text-reena-blue">
            {p.model}
          </span>
          <span className="mono-label rounded-full border border-line bg-paper px-2 py-0.5 text-[8.5px] text-slate">
            Sample
          </span>
        </div>
        <h3 className="mt-1.5 text-[15.5px] font-semibold leading-snug text-ink">
          {p.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.keyStats.slice(0, 2).map((s) => (
            <span
              key={s.label}
              className="rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] text-slate ring-1 ring-line"
            >
              {s.value}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-reena-red">
          Details
          <IconArrow
            width={15}
            height={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
