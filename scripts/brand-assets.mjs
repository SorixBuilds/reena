import sharp from "sharp";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const BRAND = path.join(process.cwd(), "public", "brand");
await mkdir(BRAND, { recursive: true });

/* ── favicons from the shield ─────────────────────────────────── */
const shield = await readFile(path.join(BRAND, "reena-shield.svg"));

for (const size of [180, 192, 512]) {
  // pad the shield onto a night-coloured square so it reads at small sizes
  const inner = Math.round(size * 0.74);
  const icon = await sharp(shield, { density: 600 })
    .resize({ width: inner, height: Math.round((inner * 142) / 120), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: "#050A1A" },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(path.join(BRAND, size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`));
}
/* browsers request /favicon.ico whatever the <link> tags say — an ICO wrapping a
   32×32 PNG is the smallest thing that satisfies them */
{
  const png = await sharp({
    create: { width: 32, height: 32, channels: 4, background: "#050A1A" },
  })
    .composite([
      {
        input: await sharp(shield, { density: 600 })
          .resize({ width: 24, height: 28, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry[0] = 32; // width
  entry[1] = 32; // height
  entry[2] = 0; // palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12); // offset past header + entry

  await writeFile(
    path.join(process.cwd(), "public", "favicon.ico"),
    Buffer.concat([header, entry, png])
  );
}

console.log("✓ favicons");

/* ── OG image, 1200×630 ───────────────────────────────────────── */
const W = 1200;
const H = 630;

const hero = await sharp(path.join(process.cwd(), "public", "img", "hero-coil-1920.webp"))
  .resize(W, H, { fit: "cover", position: "center" })
  .modulate({ brightness: 0.95 })
  .toBuffer();

const crest = await sharp(shield, { density: 600 })
  .resize({ height: 150 })
  .png()
  .toBuffer();

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#050A1A" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="#050A1A" stop-opacity="0.82"/>
      <stop offset="1" stop-color="#0A1330" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="sig" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#C8232B"/>
      <stop offset="1" stop-color="#29438E"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect y="${H - 6}" width="${W}" height="6" fill="url(#sig)"/>

  <text x="250" y="152" fill="#FFFFFF" font-family="Archivo, Arial Black, sans-serif"
        font-size="54" font-weight="800" letter-spacing="9">REENA</text>
  <text x="252" y="182" fill="#A3AECB" font-family="JetBrains Mono, Consolas, monospace"
        font-size="17" letter-spacing="7">WORLD CLASS</text>

  <text x="86" y="330" fill="#F2F5FF" font-family="Archivo, Arial Black, sans-serif"
        font-size="68" font-weight="800" letter-spacing="-1.5">Steady power.</text>
  <text x="86" y="408" fill="#F2F5FF" font-family="Archivo, Arial Black, sans-serif"
        font-size="68" font-weight="800" letter-spacing="-1.5">Made in Pakistan.</text>

  <text x="86" y="486" fill="#A3AECB" font-family="Inter Tight, Segoe UI, sans-serif"
        font-size="24">Stabilizers · Solar Inverters · MPPT Chargers · Wires</text>

  <rect x="86" y="528" width="304" height="46" rx="23" fill="none" stroke="#1A2A5C" stroke-width="1.5"/>
  <text x="108" y="557" fill="#6E8BFF" font-family="JetBrains Mono, Consolas, monospace"
        font-size="15" letter-spacing="2">Registered Trademark 141301</text>
</svg>`);

await sharp(hero)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: crest, top: 46, left: 86 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(BRAND, "og.jpg"));

console.log("✓ og.jpg");

/* ── keep the supplied logo beside the project for reference ──── */
try {
  await mkdir(path.join(process.cwd(), "brand"), { recursive: true });
  await copyFile(
    path.join(process.cwd(), "Reena logo.jpg"),
    path.join(process.cwd(), "brand", "reena-logo.jpg")
  );
  console.log("✓ brand/reena-logo.jpg (reference)");
} catch (e) {
  console.log("· logo copy skipped:", e.message);
}
