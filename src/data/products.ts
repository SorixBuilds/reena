export type Category = "stabilizers" | "inverters" | "mppt" | "wires";

export type Product = {
  slug: string;
  model: string;
  name: string;
  category: Category;
  bestFor: string[];
  keyStats: { value: string; label: string }[];
  specs: [string, string][];
  inBox?: string[];
  sample: true;
};

export const products: Product[] = [
  {
    slug: "rs-1000",
    model: "RS-1000",
    name: "Fridge & TV Stabilizer",
    category: "stabilizers",
    bestFor: ["Refrigerator", "LED TV"],
    keyStats: [
      { value: "1000 W", label: "Capacity" },
      { value: "100–260 V", label: "Input range" },
      { value: "220 V", label: "Output" },
    ],
    specs: [
      ["Capacity", "1000 W / 1.2 kVA"],
      ["Input range", "100–260 V"],
      ["Output", "220 V ±3%"],
      ["Type", "Relay, automatic"],
      ["Time delay", "3 min (compressor protection)"],
      ["Display", "Digital, input/output"],
      ["Protection", "High/low cut-off, overload, thermal"],
      ["Winding", "Copper"],
      ["Phase", "Single"],
    ],
    inBox: ["Stabilizer unit", "Wall mount bracket", "User guide", "Warranty card"],
    sample: true,
  },
  {
    slug: "rs-3000",
    model: "RS-3000",
    name: "Home Stabilizer",
    category: "stabilizers",
    bestFor: ["1-ton AC", "Fridge + TV + fans"],
    keyStats: [
      { value: "3000 W", label: "Capacity" },
      { value: "100–260 V", label: "Input range" },
      { value: "220 V", label: "Output" },
    ],
    specs: [
      ["Capacity", "3000 W / 3.5 kVA"],
      ["Input range", "100–260 V"],
      ["Output", "220 V ±3%"],
      ["Type", "Relay, automatic"],
      ["Time delay", "3 min"],
      ["Display", "Digital"],
      ["Protection", "High/low cut-off, overload, thermal"],
      ["Winding", "Copper"],
      ["Phase", "Single"],
    ],
    inBox: ["Stabilizer unit", "Wall mount bracket", "User guide", "Warranty card"],
    sample: true,
  },
  {
    slug: "rs-5000",
    model: "RS-5000",
    name: "AC Stabilizer",
    category: "stabilizers",
    bestFor: ["1.5-ton AC", "Fridge + TV"],
    keyStats: [
      { value: "5000 W", label: "Capacity" },
      { value: "100–260 V", label: "Input range" },
      { value: "220 V ±3%", label: "Output" },
    ],
    specs: [
      ["Capacity", "5000 W / 6 kVA"],
      ["Input range", "100–260 V"],
      ["Output", "220 V ±3%"],
      ["Type", "Relay, automatic"],
      ["Time delay", "3 min"],
      ["Display", "Digital, input/output/load"],
      ["Protection", "High/low cut-off, overload, short circuit, thermal"],
      ["Winding", "Copper"],
      ["Phase", "Single"],
    ],
    inBox: ["Stabilizer unit", "Wall mount bracket", "User guide", "Warranty card"],
    sample: true,
  },
  {
    slug: "rs-10000",
    model: "RS-10000",
    name: "Whole-Home Stabilizer",
    category: "stabilizers",
    bestFor: ["2 ACs", "Whole house"],
    keyStats: [
      { value: "10000 W", label: "Capacity" },
      { value: "90–260 V", label: "Input range" },
      { value: "220 V", label: "Output" },
    ],
    specs: [
      ["Capacity", "10000 W / 12 kVA"],
      ["Input range", "90–260 V"],
      ["Output", "220 V ±3%"],
      ["Type", "Relay, automatic"],
      ["Display", "Digital"],
      ["Protection", "High/low cut-off, overload, short circuit, thermal"],
      ["Winding", "Copper"],
      ["Phase", "Single"],
    ],
    inBox: ["Stabilizer unit", "Floor stand feet", "User guide", "Warranty card"],
    sample: true,
  },
  {
    slug: "rpv-3-6k-24",
    model: "RPV-3.6K-24",
    name: "Hybrid Solar Inverter 3.6 kW",
    category: "inverters",
    bestFor: ["Small home", "Fans, lights, fridge"],
    keyStats: [
      { value: "3.6 kW", label: "Rated power" },
      { value: "24 V", label: "Battery" },
      { value: "Pure sine", label: "Output" },
    ],
    specs: [
      ["Rated power", "3600 W"],
      ["Battery voltage", "24 V"],
      ["PV input range", "60–450 V"],
      ["Max PV power", "4000 W"],
      ["Max solar charge", "100 A"],
      ["Output", "230 V ±5%, pure sine wave"],
      ["Transfer time", "10 ms"],
      ["Battery types", "Lead-acid, lithium"],
      ["Display", "LCD"],
    ],
    inBox: ["Inverter unit", "PV connectors", "Communication cable", "User guide"],
    sample: true,
  },
  {
    slug: "rpv-6k-48",
    model: "RPV-6K-48",
    name: "Hybrid Solar Inverter 6 kW",
    category: "inverters",
    bestFor: ["Large home", "1–2 ACs on solar"],
    keyStats: [
      { value: "6 kW", label: "Rated power" },
      { value: "48 V", label: "Battery" },
      { value: "Pure sine", label: "Output" },
    ],
    specs: [
      ["Rated power", "6000 W"],
      ["Battery voltage", "48 V"],
      ["PV input range", "60–500 V"],
      ["Max PV power", "6500 W"],
      ["Max solar charge", "120 A"],
      ["Output", "230 V ±5%, pure sine wave"],
      ["Transfer time", "10 ms"],
      ["Battery types", "Lead-acid, lithium"],
      ["Display", "LCD"],
    ],
    inBox: ["Inverter unit", "PV connectors", "Communication cable", "User guide"],
    sample: true,
  },
  {
    slug: "rsc-40",
    model: "RSC-40",
    name: "MPPT Solar Charger 40 A",
    category: "mppt",
    bestFor: ["12/24 V systems", "Small solar setups"],
    keyStats: [
      { value: "40 A", label: "Max charge" },
      { value: "12/24 V", label: "Battery" },
      { value: "MPPT", label: "Tracking" },
    ],
    specs: [
      ["Max charge current", "40 A"],
      ["Battery voltage", "12/24 V auto"],
      ["Max PV open-circuit voltage", "100 V"],
      ["Battery types", "Lead-acid, gel, lithium"],
      ["Charging stages", "Bulk, absorption, float"],
      ["Display", "LCD"],
      ["Protection", "Reverse polarity, short circuit, over-temperature"],
    ],
    inBox: ["Charge controller", "Temperature sensor", "Mounting screws", "User guide"],
    sample: true,
  },
  {
    slug: "rsc-60",
    model: "RSC-60",
    name: "MPPT Solar Charger 60 A",
    category: "mppt",
    bestFor: ["24/48 V systems", "Home solar"],
    keyStats: [
      { value: "60 A", label: "Max charge" },
      { value: "12/24/48 V", label: "Battery" },
      { value: "MPPT", label: "Tracking" },
    ],
    specs: [
      ["Max charge current", "60 A"],
      ["Battery voltage", "12/24/48 V auto"],
      ["Max PV open-circuit voltage", "150 V"],
      ["Battery types", "Lead-acid, gel, lithium"],
      ["Charging stages", "Bulk, absorption, float"],
      ["Display", "LCD"],
      ["Protection", "Reverse polarity, short circuit, over-temperature"],
    ],
    inBox: ["Charge controller", "Temperature sensor", "Mounting screws", "User guide"],
    sample: true,
  },
  {
    slug: "rw-3-29",
    model: "RW-3/29",
    name: "House Wire 3/29 (1.5 mm²)",
    category: "wires",
    bestFor: ["Lights", "Fans"],
    keyStats: [
      { value: "3/29", label: "Size" },
      { value: "1.5 mm²", label: "Approx. metric" },
      { value: "90 m", label: "Coil" },
    ],
    specs: [
      ["Size", "3/.029 (≈1.5 mm²)"],
      ["Conductor", "Copper"],
      ["Insulation", "PVC"],
      ["Coil length", "90 m"],
      ["Colours", "Red, black, yellow, green, blue"],
      ["Typical use", "Lighting and fan circuits"],
    ],
    inBox: ["90 m coil", "Reena coil label"],
    sample: true,
  },
  {
    slug: "rw-7-29",
    model: "RW-7/29",
    name: "House Wire 7/29 (2.5 mm²)",
    category: "wires",
    bestFor: ["Sockets", "Small appliances"],
    keyStats: [
      { value: "7/29", label: "Size" },
      { value: "2.5 mm²", label: "Approx. metric" },
      { value: "90 m", label: "Coil" },
    ],
    specs: [
      ["Size", "7/.029 (≈2.5 mm²)"],
      ["Conductor", "Copper"],
      ["Insulation", "PVC"],
      ["Coil length", "90 m"],
      ["Colours", "Red, black, yellow, green, blue"],
      ["Typical use", "Power sockets"],
    ],
    inBox: ["90 m coil", "Reena coil label"],
    sample: true,
  },
  {
    slug: "rw-7-36",
    model: "RW-7/36",
    name: "House Wire 7/36 (4 mm²)",
    category: "wires",
    bestFor: ["AC lines", "Main supply"],
    keyStats: [
      { value: "7/36", label: "Size" },
      { value: "4 mm²", label: "Approx. metric" },
      { value: "90 m", label: "Coil" },
    ],
    specs: [
      ["Size", "7/.036 (≈4 mm²)"],
      ["Conductor", "Copper"],
      ["Insulation", "PVC"],
      ["Coil length", "90 m"],
      ["Colours", "Red, black"],
      ["Typical use", "AC and heavy-load circuits"],
    ],
    inBox: ["90 m coil", "Reena coil label"],
    sample: true,
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const related = (slug: string) => {
  const p = bySlug(slug);
  if (!p) return [];
  const same = products.filter((x) => x.category === p.category && x.slug !== slug);
  const others = products.filter((x) => x.category !== p.category);
  return [...same, ...others].slice(0, 3);
};
