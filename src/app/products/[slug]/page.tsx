import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { products, bySlug } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return { title: "Product" };
  return {
    title: `${p.model} — ${p.name}`,
    description: `${p.model}: ${p.keyStats.map((s) => `${s.value} ${s.label}`).join(", ")}. Sample specifications.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
