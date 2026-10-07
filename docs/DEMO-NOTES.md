# REENA demo — what's real, what's sample, what we need

**For:** Rajesh Kumar — REENA (manufacturer) / Jan Electrical (shop), Ghotki, Sindh
**Built by:** Sorix Unified Systems
**Status:** frontend sales demo. No backend, no data is stored or sent anywhere.

> **Say this to the client, in these words:**
> "Yeh demo hai. Specs aur model sample hain. Aap ke asli products, photos aur rates
> final website mein aayenge."

---

## 1. What the site claims as fact

Only these, and every one came from the business card or the conversation:

- Reena does its own manufacturing
- Sold through dealers across Pakistan
- Registered Trademark No. **141301**
- The four product lines: stabilizers, solar inverters, MPPT/solar chargers, wires
- Jan Electrical, Near Qoumi Bachat Bank, By Pass, Ghotki
- WhatsApp 0333-3199455 · Phone 0313-3199455

**Deliberately not claimed anywhere:** years in business, number of dealers, named
cities, certifications, awards, ratings, "No. 1" or "best in Pakistan".

## 2. What is sample data

Everything in `src/data/products.ts` carries `sample: true`, and every spec table on
the site shows a **"Sample specs"** chip. The 11 models (RS-1000 → RS-10000,
RPV-3.6K-24, RPV-6K-48, RSC-40, RSC-60, RW-3/29, RW-7/29, RW-7/36) are a **proposed
naming system**, not Reena's catalogue. The values sit in ranges seen in the Pakistani
market so the pages look right — they are not Reena's measured figures.

Also illustrative:

- The **voltage simulator** is labelled "Illustration · sample range 100–260 V"
- The **Pakistan map** shows only Ghotki, with "Dealer cities shown in the final website"
- The **product images are SVG illustrations**, not photographs of Reena units
- The **genuine check** result is hard-coded, and says so on screen

## 3. Copy that needs Rajesh to confirm — flagged per the brief

| Where | Phrase | Why |
|---|---|---|
| Home, S8 | "**Checked before it leaves**" | We have no confirmation of an outgoing QC step. If he doesn't confirm, the heading becomes just "Made in our own facility." |
| Home, S8 | "Reena **designs** and builds its range" | Designing in-house is a stronger claim than assembling in-house. Confirm before the final site. |
| Home, S8 | "**Copper inside** — copper windings and wiring" | Confirm the windings really are copper, not CCA. |
| Products | "Time delay 3 min (compressor protection)" | Sample spec. Confirm Reena stabilizers actually have a time delay. |
| Trademark | "Registered Trademark No. 141301" | Aneeza to see the certificate before the final site goes live. |

## 4. What is UI-only in this demo

These look and feel complete but do nothing behind the scenes. Each one shows the
toast **"Demo preview: yeh feature final website mein chalega."**

- **Download datasheet** (product pages)
- **Genuine check** — the format `RN-00-000000` returns a pass, anything else returns
  "Serial not found". A real check needs Reena to run a serial system.
- **"Which stabilizer?" helper** — a fixed mapping, labelled "Suggestion only"
- **Dealer map arcs** — decorative; no real dealer locations

**These work for real and go to the client's own numbers:** every WhatsApp link (with
the right prefilled message), every `tel:` link, and the Google Maps link. The dealer
form has no backend on purpose — it builds a WhatsApp message from the fields and
opens WhatsApp, which works without a server.

## 5. What we need from Rajesh to turn this into his website

In rough order of how much it changes the site:

1. **Product photos.** Phone photos against a plain white wall in daylight are enough.
   These replace the SVG illustrations and are the single biggest upgrade.
2. **Factory photos** — the "Made by Reena" collage has a placeholder ribbon saying
   "Your factory photos go here" so he can see exactly what's needed.
3. **Real model names, capacities and specs** for each of the four lines.
4. **Which charger it actually is** — MPPT charge controller, PWM, battery charger, or
   a "solar charger" inverter. Worth a voice note.
5. **Wire range** — sizes, coil length, copper purity, standard.
6. **Warranty terms.** Product pages currently read "To be confirmed by Reena."
7. **Dealer cities** for the map, and shop hours for the contact page.
8. The **trademark certificate**.

## 6. Technical notes

- Next.js (App Router) with `output: 'export'` — a fully static site, deploys to
  Netlify from `out/`.
- `noindex, nofollow` is set in the page metadata **and** as a Netlify header. This is
  a demo and should not appear in search results.
- Urdu toggle covers navigation, headings and buttons. Body copy and spec tables stay
  English in this demo — the footer says so in Urdu. A full Urdu version is a separate
  piece of work.
- Motion respects `prefers-reduced-motion` throughout. Smooth scrolling is desktop-only;
  phones keep native scroll.
- The OG image at `public/brand/og.jpg` is what shows in the WhatsApp link preview.
- Image budgets are all met (hero mobile 115 KB, hero desktop 180 KB, cards 68 KB).
  **The JS budget is not:** 231 KB gzip on the home page against a 170 KB target. Around
  166 KB of that is the Next.js App Router and React baseline and ~28 KB is GSAP; our own
  code is ~37 KB. Worth raising before the production build, because the fix is a
  framework decision, not a code cleanup.

## 7. Before sending it

- Have a native Urdu reader check the strings in `src/data/i18n.ts`. The client will
  notice a single wrong letter in his own language.
- Send the Netlify link on WhatsApp **and** a 30–45 second screen recording of the site
  being scrolled on a phone. He will watch the video, and he will forward it.
