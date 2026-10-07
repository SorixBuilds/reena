import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { images } from "./images.config.mjs";

const RAW = path.join(process.cwd(), "scripts", "raw");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function get(url, dest, label) {
  if (await exists(dest)) {
    console.log(`  ·  cached   ${label}`);
    return true;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
          Accept: "image/avif,image/webp,image/jpeg,*/*",
        },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 8000) throw new Error(`too small (${buf.length}B)`);
      await writeFile(dest, buf);
      console.log(`  ✓  ${label}  ${(buf.length / 1024).toFixed(0)} KB`);
      return true;
    } catch (e) {
      if (attempt === 3) {
        console.log(`  ✗  ${label}  ${e.message}`);
        return false;
      }
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }
  }
}

await mkdir(RAW, { recursive: true });
console.log(`Downloading ${images.length} primaries + alternates → scripts/raw\n`);

const failed = [];
for (const img of images) {
  const ok = await get(img.url, path.join(RAW, `${img.name}.jpg`), img.name);
  if (!ok) failed.push(img.name);
  if (img.alt) await get(img.alt, path.join(RAW, `${img.name}--alt.jpg`), `${img.name} (alt)`);
  if (img.portraitFrom)
    await get(
      img.portraitFrom,
      path.join(RAW, `${img.name}--portrait-src.jpg`),
      `${img.name} (portrait src)`
    );
}

console.log(
  `\nDone. ${images.length - failed.length}/${images.length} primaries.` +
    (failed.length ? `  Missing: ${failed.join(", ")}` : "")
);
