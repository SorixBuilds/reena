import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : path.join(d, e.name)
  );

const gz = (f) => gzipSync(readFileSync(f)).length;

console.log("── JS chunks (gzip) ──");
const chunks = walk("out/_next/static/chunks")
  .filter((f) => f.endsWith(".js"))
  .map((f) => ({ file: path.basename(f), kb: +(gz(f) / 1024).toFixed(1) }))
  .sort((a, b) => b.kb - a.kb);
chunks.slice(0, 8).forEach((c) => console.log(`  ${String(c.kb).padStart(6)} KB  ${c.file}`));

console.log("\n── per page (gzip, JS actually referenced) ──");
for (const page of ["index", "products/index", "dealers/index", "genuine/index", "contact/index", "products/rs-5000/index"]) {
  const html = `out/${page}.html`;
  if (!existsSync(html)) continue;
  const src = readFileSync(html, "utf8");
  const refs = [...new Set([...src.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0]))];
  let total = 0;
  for (const r of refs) {
    const fp = path.join("out", r);
    if (existsSync(fp)) total += gz(fp);
  }
  const htmlKb = gz(html) / 1024;
  console.log(
    `  ${page.replace("/index", "") || "/"}`.padEnd(26) +
      `JS ${(total / 1024).toFixed(1).padStart(6)} KB · HTML ${htmlKb.toFixed(1)} KB`
  );
}

console.log("\n── image budgets ──");
const imgs = readdirSync("out/img");
const biggest = (pattern, label, budget) => {
  const hits = imgs
    .filter((f) => pattern.test(f))
    .map((f) => ({ f, kb: statSync(path.join("out/img", f)).size / 1024 }))
    .sort((a, b) => b.kb - a.kb);
  if (!hits.length) return;
  const top = hits[0];
  const ok = top.kb <= budget ? "ok " : "OVER";
  console.log(`  ${ok} ${label}: ${top.kb.toFixed(0)} KB (budget ${budget}) — ${top.f}`);
};
biggest(/^hero-.*-portrait\.avif$/, "hero mobile AVIF", 120);
biggest(/^hero-.*-(1920|2560)\.avif$/, "hero desktop AVIF", 260);
biggest(/^(?!hero)[a-z-]+-828\.avif$/, "card AVIF @828", 70);
