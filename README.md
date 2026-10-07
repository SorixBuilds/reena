# REENA — demo website

A frontend-only sales demo for **REENA** (Rajesh Kumar, Ghotki, Sindh), built by
Sorix Unified Systems. No backend, no data processing.

**Read [`docs/DEMO-NOTES.md`](docs/DEMO-NOTES.md) before showing this to the client.**
It lists what's real, what's sample, and what we still need from Rajesh.

## Run it

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build
```

Static output lands in `out/`. Deploy that folder to Netlify — `netlify.toml` is set up
with the build command, cache headers and a `noindex` header. **This is a demo and must
stay out of search results.**

## Regenerating assets

| Command | What it does |
|---|---|
| `npm run images:fetch` | Downloads source photos to `scripts/raw/` (Pexels + Unsplash only) |
| `npm run images:sheet` | Builds contact sheets in `scripts/qa/` for visual QA |
| `npm run images:build` | Writes AVIF + WebP responsive sets to `public/img/` |
| `node scripts/brand-assets.mjs` | Favicons and the WhatsApp OG preview image |
| `node scripts/budget.mjs` | Reports JS and image sizes against the budgets |

Run them in that order after changing the image manifest in
`scripts/images.config.mjs`. QA decisions are logged in
[`docs/IMAGE-CREDITS.md`](docs/IMAGE-CREDITS.md).

## Where things live

```
src/
  app/            routes — home, products, products/[slug], dealers, genuine, contact, 404
  components/
    ShieldMark    the trademark shield, traced by hand — do not alter proportions
    Crest         shield + "WORLD CLASS" ribbon, for large uses
    ReenaWave     the signature voltage line: chaos morphs into a clean sine
    ProductMock   SVG product renders (stabilizer, inverter, MPPT, wire coil)
    DealerMap     Pakistan outline plotted from real coordinates
    home/         the twelve home sections, S1 → S12
  data/           products, categories, applications, Urdu strings
  config/site.ts  the single source for every phone number and address
  lib/gsap.ts     plugin registration, matchMedia contexts, line-split helpers
```

## Things worth knowing before you edit

- **Every contact detail comes from `src/config/site.ts`.** Change it there, nowhere else.
- **Product data is sample data.** Every item in `src/data/products.ts` carries
  `sample: true`, and the UI shows a "Sample specs" chip wherever specs appear. Keep
  that chip if you add specs.
- **No invented facts.** See the allowed-claims list in `docs/DEMO-NOTES.md`.
- **Mobile first.** Design and test at 375 wide before anything else — the client and
  his customers are phone users.
- Animation respects `prefers-reduced-motion` throughout; smooth scrolling and pinned
  sections are desktop-only (`(min-width: 1024px) and (pointer: fine)`).
- Urdu headings skip the line-split reveal — splitting Arabic-script text into word
  spans reverses the bidi run. `revealLines()` detects this and fades instead.

## Measured against the brief's budgets

| Target | Result |
|---|---|
| Hero mobile AVIF ≤ 120 KB | 115 KB |
| Hero desktop AVIF ≤ 260 KB | 180 KB |
| Card AVIF @828 ≤ 70 KB | 68 KB |
| JS (gzip, home) ≤ 170 KB | **231 KB** — see below |

The JS budget is not met. About 166 KB of that is the Next.js App Router and React
baseline, which is fixed, and ~28 KB is GSAP with ScrollTrigger, which the whole design
depends on. Our own code is ~37 KB. Lenis is dynamically imported and only loads on
desktop pointers. If the number has to come down for the production build, the lever is
the framework choice, not this code.
