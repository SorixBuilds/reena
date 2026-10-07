# Image credits and licences

Every image is self-hosted. Only **Pexels License** and **Unsplash License** sources
were used — no Unsplash+ and no third-party brand marks.

Pipeline: `scripts/fetch-images.mjs` → `scripts/contact-sheet.mjs` (visual QA) →
`scripts/build-images.mjs` (AVIF + WebP at 480/828/1200/1920, 2560 and a 1080×1600
portrait crop for hero slides).

All images carry a shared navy grade (saturation 0.9, per-channel
`linear([0.95, 0.965, 1.035], [3, 5, 14])`) so the set reads as one brand.

| File stem | Use | Source | Photographer | Licence |
|---|---|---|---|---|
| `hero-coil` | Hero slide 1 · Stabilizers (LCP) | [Pexels 12515072](https://www.pexels.com/photo/12515072/) | Vadim Timayev | Pexels |
| `hero-pcb-blue` | Hero slide 2 · Solar Inverters | [Unsplash pfR18JNEMv8](https://unsplash.com/photos/pfR18JNEMv8) | Vishnu Mohanan | Unsplash |
| `hero-solar-dusk` | Hero slide 3 · MPPT | [Pexels 371917](https://www.pexels.com/photo/371917/) | Pexels contributor | Pexels |
| `hero-copper-red` | Hero slide 4 · Wires | [Pexels 28286038](https://www.pexels.com/photo/copper-wire-28286038/) | Nic Wood | Pexels |
| `cat-stabilizer` | Category card | [Pexels 8108716](https://www.pexels.com/photo/8108716/) | Mikhail Nilov | Pexels |
| `cat-inverter` | Category card | [Unsplash 1580584126903](https://unsplash.com/photos/1580584126903) | Michael Dziedzic | Unsplash |
| `cat-mppt` | Category card | [Pexels 14673396](https://www.pexels.com/photo/14673396/) | Jamshaid Anwar | Pexels |
| `cat-wires` | Category card | [Pexels 28286038](https://www.pexels.com/photo/copper-wire-28286038/) | Nic Wood | Pexels |
| `app-village-night` | Homes | [Pexels 37120321](https://www.pexels.com/photo/37120321/) — Kandiaro, Sindh | Saeed Ahmed Abbasi | Pexels |
| `app-fridge` | Refrigerators | [Pexels 17386217](https://www.pexels.com/photo/17386217/) | Moustafa AbdlRazik | Pexels |
| `app-ac` | Air conditioners | [Pexels 3964537](https://www.pexels.com/photo/3964537/) | ready made | Pexels |
| `app-office` | Offices | [Pexels 15389577](https://www.pexels.com/photo/15389577/) | Carsten Ruthemann | Pexels |
| `app-factory` | Commercial & industrial | [Pexels 34718925](https://www.pexels.com/photo/34718925/) | Yetkin Ağaç | Pexels |
| `app-rooftop-solar` | Solar systems | [Pexels 14673364](https://www.pexels.com/photo/14673364/) — Lahore | Jamshaid Anwar | Pexels |
| `bg-tower-night` | Sun to Socket background | [Pexels 27824579](https://www.pexels.com/photo/27824579/) | Christopher Borges | Pexels |
| `mfg-soldering` | Made by Reena | [Pexels 3912983](https://www.pexels.com/photo/3912983/) | ThisIsEngineering | Pexels |
| `mfg-hands` | Made by Reena | [Pexels 35187505](https://www.pexels.com/photo/35187505/) | Bulat843 | Pexels |
| `mfg-coils` | Made by Reena (third collage image) | [Pexels 3912981](https://www.pexels.com/photo/3912981/) | ThisIsEngineering | Pexels |
| `genuine-pcb` | Genuine check teaser | [Unsplash 1631375937044](https://unsplash.com/photos/1631375937044) | Vishnu Mohanan | Unsplash |
| `dealer-shop` | Dealers page | [Pexels 2598290](https://www.pexels.com/photo/2598290/) — Faisalabad | Aadil | Pexels |

---

## Visual QA log

The contact sheets in `scripts/qa/` were inspected at full size before the build.
Four decisions were made:

1. **`hero-solar-dusk` — primary rejected, alternate used.**
   Pexels 16586150 is a bright, pale-sky daylight shot. The hero is specified dark,
   and light imagery there breaks the set. Replaced with Pexels 371917 (panels at
   sunset, dark silhouette and golden sky).

2. **`mfg-coils` — primary rejected, replaced.**
   Pexels 33339861 shows grey steel wire in what reads as a scrapyard — off-brief for
   a premium manufacturing collage. Replaced with Pexels 3912981 (engineer at a
   microscope), which sits consistently beside the other two manufacturing images.
   The listed alternate, Pexels 6069107, was also rejected: it is a plate of food,
   not wire coils.

3. **`hero-pcb-blue` — portrait source rejected.**
   Pexels 2182863 is murky and low-contrast at portrait crop. The phone crop is taken
   from the primary image instead, which holds detail at 1080×1600.

4. **`mfg-soldering` — accepted with a crop.**
   An out-of-focus box in the top-left corner carries unreadable red text that may be
   a brand. The crop centre was moved to `62% 58%` so the frame sits on the engineer
   and the box falls outside it.

**`dealer-shop` was checked at full resolution.** It is a Pakistani electrical shop
with many small boxes on the shelves; none of the labels are legible at any size the
site serves. Accepted.

`cat-stabilizer` and `genuine-pcb` are green-dominant PCB shots. Green is a status
colour in this palette, not a brand colour, so both are desaturated to 0.3 before the
navy grade pulls them toward the brand blue.

## Product imagery

No stock photo can show a Reena-branded device, so all products are drawn as SVG
components in `src/components/ProductMock.tsx` (stabilizer, inverter, MPPT charger,
wire coil). **These are illustrations. The client's real product photos replace them
in the final website.**
