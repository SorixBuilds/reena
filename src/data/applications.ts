export type Application = {
  key: string;
  title: string;
  line: string;
  image: string;
  icon: "home" | "fridge" | "snowflake" | "building" | "factory" | "sun";
  wide?: boolean;
};

export const applications: Application[] = [
  {
    key: "homes",
    title: "Homes",
    line: "Steady power for lights, fans and everyday appliances.",
    image: "app-village-night",
    icon: "home",
    wide: true,
  },
  {
    key: "fridge",
    title: "Refrigerators",
    line: "Delay and cut-off protection for the compressor.",
    image: "app-fridge",
    icon: "fridge",
  },
  {
    key: "ac",
    title: "Air Conditioners",
    line: "Stable voltage through hot summer evenings.",
    image: "app-ac",
    icon: "snowflake",
  },
  {
    key: "offices",
    title: "Offices",
    line: "Protect computers, printers and networks.",
    image: "app-office",
    icon: "building",
  },
  {
    key: "industrial",
    title: "Commercial & Industrial",
    line: "Power for shops, workshops and machinery.",
    image: "app-factory",
    icon: "factory",
  },
  {
    key: "solar",
    title: "Solar Systems",
    line: "Inverters, chargers and wires for complete solar setups.",
    image: "app-rooftop-solar",
    icon: "sun",
    wide: true,
  },
];
