import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const RAW = path.join(process.cwd(), "scripts", "raw");
const OUT = path.join(process.cwd(), "scripts", "qa");

const COLS = 4;
const CW = 440;
const CH = 300;
const PAD = 10;
const LABEL = 30;
const PER_SHEET = 12;

const files = (await readdir(RAW)).filter((f) => f.endsWith(".jpg")).sort();
await mkdir(OUT, { recursive: true });

const chunks = [];
for (let i = 0; i < files.length; i += PER_SHEET) chunks.push(files.slice(i, i + PER_SHEET));

let n = 0;
for (const chunk of chunks) {
  n++;
  const rows = Math.ceil(chunk.length / COLS);
  const W = COLS * (CW + PAD) + PAD;
  const H = rows * (CH + LABEL + PAD) + PAD;

  const tiles = [];
  const labels = [];
  for (let i = 0; i < chunk.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = PAD + col * (CW + PAD);
    const top = PAD + row * (CH + LABEL + PAD);
    const buf = await sharp(path.join(RAW, chunk[i]))
      .resize(CW, CH, { fit: "cover" })
      .toBuffer();
    tiles.push({ input: buf, left, top });
    const name = chunk[i].replace(".jpg", "");
    labels.push(
      `<text x="${left + 4}" y="${top + CH + 20}" fill="#ffffff" font-family="monospace" font-size="15">${name}</text>`
    );
  }

  const text = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${labels.join("")}</svg>`
  );

  await sharp({
    create: { width: W, height: H, channels: 3, background: "#101420" },
  })
    .composite([...tiles, { input: text, left: 0, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, `contact-sheet-${n}.jpg`));

  console.log(`contact-sheet-${n}.jpg  (${chunk.length} images)`);
}
console.log(`\n${files.length} images across ${n} sheet(s) → scripts/qa/`);
