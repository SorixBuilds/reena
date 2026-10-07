import type { Category } from "./products";

export type CategoryCard = {
  key: Category;
  num: string;
  title: string;
  line: string;
  image: string;
  mock: "stabilizer" | "inverter" | "mppt" | "coil";
  chip: string;
};

export const categories: CategoryCard[] = [
  {
    key: "stabilizers",
    num: "01",
    title: "Voltage Stabilizers",
    line: "Protect fridges, ACs and every appliance from voltage ups and downs.",
    image: "cat-stabilizer",
    mock: "stabilizer",
    chip: "RS-1000 → RS-10000",
  },
  {
    key: "inverters",
    num: "02",
    title: "Solar Inverters",
    line: "Run your home on solar, with battery backup when the grid goes.",
    image: "cat-inverter",
    mock: "inverter",
    chip: "RPV-3.6K · RPV-6K",
  },
  {
    key: "mppt",
    num: "03",
    title: "MPPT & Solar Chargers",
    line: "Get the most out of every panel and charge batteries safely.",
    image: "cat-mppt",
    mock: "mppt",
    chip: "RSC-40 · RSC-60",
  },
  {
    key: "wires",
    num: "04",
    title: "Electrical Wires",
    line: "Copper wires for homes, shops and solar systems.",
    image: "cat-wires",
    mock: "coil",
    chip: "3/29 · 7/29 · 7/36",
  },
];

export const categoryLabel: Record<Category, string> = {
  stabilizers: "Voltage Stabilizers",
  inverters: "Solar Inverters",
  mppt: "MPPT & Chargers",
  wires: "Wires",
};
