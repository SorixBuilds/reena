import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { images, WIDTHS, PORTRAIT } from "./images.config.mjs";

const RAW = path.join(process.cwd(), "scripts", "raw");
const OUT = path.join(process.cwd(), "public", "img");

/**
 * Visual QA outcomes (see docs/IMAGE-CREDITS.md):
 *  - hero-solar-dusk : primary was bright daylight where dark was specified → use alternate
 *  - mfg-coils       : primary was a scrapyard wire subject, off-brief → use alternate engineer shot
 *  - hero-pcb-blue   : the supplied portrait source was murky → crop the portrait from the primary
 *  - mfg-soldering   : crop shifted right, away from an out-of-focus branded box top-left
 */
const QA = {
  "hero-solar-dusk": { use: "alt" },
  "mfg-coils": { use: "alt-swap", from: "mfg-hands--alt" },
  "mfg-soldering": { position: "62% 58%" },
  "hero-pcb-blue": { portraitFromPrimary: true },
};

/**
 * Navy unification grade.
 * A flat #0A1330 multiply composite crushes the frame to black (sharp has no
 * opacity on composite inputs), so the tone is applied per channel instead:
 * reds/greens pulled back, blue lifted, with a small navy floor in the shadows.
 */
const gradeNavy = (img, saturation = 0.9) =>
  img.modulate({ saturation }).linear([0.95, 0.965, 1.035], [3, 5, 14]);

function gravityFrom(position = "center") {
  // map "55% 50%" → an extract-position sharp understands
  if (position === "center") return { x: 0.5, y: 0.5 };
  const [x, y] = position.split(/\s+/).map((v) => parseFloat(v) / 100);
  return { x: isNaN(x) ? 0.5 : x, y: isNaN(y) ? 0.5 : y };
}

async function pipeline(src, w, h, pos, extraDesat = false) {
  const img = sharp(src, { failOn: "none" });
  const meta = await img.metadata();
  const { x, y } = gravityFrom(pos);

  // manual cover-crop so object-position is baked into the file
  const targetRatio = w / h;
  const srcRatio = meta.width / meta.height;
  let cw, ch;
  if (srcRatio > targetRatio) {
    ch = meta.height;
    cw = Math.round(meta.height * targetRatio);
  } else {
    cw = meta.width;
    ch = Math.round(meta.width / targetRatio);
  }
  const left = Math.max(0, Math.min(meta.width - cw, Math.round(x * meta.width - cw / 2)));
  const top = Math.max(0, Math.min(meta.height - ch, Math.round(y * meta.height - ch / 2)));

  let out = img
    .extract({ left, top, width: cw, height: ch })
    .resize(w, h, { fit: "fill", kernel: "lanczos3" });

  // sharp keeps only the last modulate() in a chain, so saturation is passed through
  return gradeNavy(out, extraDesat ? 0.3 : 0.9).sharpen({ sigma: 0.6 });
}

await mkdir(OUT, { recursive: true });

let count = 0;
for (const img of images) {
  const qa = QA[img.name] || {};
  let src = path.join(RAW, `${img.name}.jpg`);
  if (qa.use === "alt") src = path.join(RAW, `${img.name}--alt.jpg`);
  if (qa.use === "alt-swap") src = path.join(RAW, `${qa.from}.jpg`);

  const pos = qa.position || img.position || "center";
  // green-dominant PCB shots get pulled toward the brand's blue
  const desat = img.name === "genuine-pcb" || img.name === "cat-stabilizer";

  const landscapeH = (w) => Math.round(w * (img.hero ? 9 / 16 : 10 / 16));

  // budgets: hero mobile ≤ 120 KB, hero desktop ≤ 260 KB, cards ≤ 70 KB at 828w
  const avifQ = (w) => (img.hero ? (w >= 1920 ? 52 : 55) : w >= 828 ? 46 : 52);

  for (const w of WIDTHS) {
    if (!img.hero && w > 1200) continue;
    const h = landscapeH(w);
    const base = await pipeline(src, w, h, pos, desat);
    await base.clone().avif({ quality: avifQ(w), effort: 6 }).toFile(path.join(OUT, `${img.name}-${w}.avif`));
    await base.clone().webp({ quality: img.hero ? 70 : 66 }).toFile(path.join(OUT, `${img.name}-${w}.webp`));
    count += 2;
  }
  // non-hero images still need a 1920 entry for the srcset to resolve
  if (!img.hero) {
    const base = await pipeline(src, 1920, 1200, pos, desat);
    await base.clone().avif({ quality: 44, effort: 6 }).toFile(path.join(OUT, `${img.name}-1920.avif`));
    await base.clone().webp({ quality: 64 }).toFile(path.join(OUT, `${img.name}-1920.webp`));
    count += 2;
  }

  if (img.hero) {
    // 2560 for large desktops
    const wide = await pipeline(src, 2560, 1440, pos, desat);
    await wide.clone().avif({ quality: 48, effort: 6 }).toFile(path.join(OUT, `${img.name}-2560.avif`));
    count++;

    // portrait crop for phones
    const psrc =
      !qa.portraitFromPrimary && img.portraitFrom
        ? path.join(RAW, `${img.name}--portrait-src.jpg`)
        : src;
    const p = await pipeline(psrc, PORTRAIT.w, PORTRAIT.h, pos, desat);
    await p.clone().avif({ quality: 46, effort: 6 }).toFile(path.join(OUT, `${img.name}-portrait.avif`));
    await p.clone().webp({ quality: 64 }).toFile(path.join(OUT, `${img.name}-portrait.webp`));
    count += 2;
  }
  console.log(`  ✓ ${img.name}`);
}

/* report the budget-critical sizes */
const files = await readdir(OUT);
const report = [];
for (const f of files) {
  const s = await stat(path.join(OUT, f));
  report.push([f, s.size]);
}
const hero = report.filter((r) => r[0].startsWith("hero-")).sort((a, b) => b[1] - a[1]);
console.log(`\n${count} files written → public/img\n`);
console.log("Largest hero assets:");
hero.slice(0, 8).forEach(([f, s]) => console.log(`  ${(s / 1024).toFixed(0).padStart(5)} KB  ${f}`));
const cards = report.filter((r) => r[0].includes("-828.avif")).sort((a, b) => b[1] - a[1]);
console.log("\nLargest cards at 828w (budget 70 KB):");
cards.slice(0, 5).forEach(([f, s]) => console.log(`  ${(s / 1024).toFixed(0).padStart(5)} KB  ${f}`));
