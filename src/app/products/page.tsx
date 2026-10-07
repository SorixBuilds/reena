import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsBrowser from "@/components/ProductsBrowser";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Reena range: voltage stabilizers, solar inverters, MPPT chargers and electrical wires.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-night" />}>
      <ProductsBrowser />
    </Suspense>
  );
}
