export const site = {
  brand: "REENA",
  tagline: "World Class",
  owner: "Rajesh Kumar",
  whatsappE164: "923333199455",
  whatsappDisplay: "0333-3199455",
  phoneE164: "+923133199455",
  phoneDisplay: "0313-3199455",
  shop: "Jan Electrical",
  address: "Near Qoumi Bachat Bank, By Pass, Ghotki, Sindh",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Jan+Electrical+Bypass+Ghotki",
  trademarkNo: "141301",
  demoBy: "Sorix Unified Systems",
};

export const wa = (text: string) =>
  `https://wa.me/${site.whatsappE164}?text=${encodeURIComponent(text)}`;

export const waText = {
  general:
    "Assalam-o-alaikum, Reena products ke baare mein maloomat chahiye.",
  dealer: "Assalam-o-alaikum, main Reena ka dealer banna chahta hoon.",
  product: (model: string) =>
    `Assalam-o-alaikum, mujhe ${model} ke baare mein maloomat chahiye.`,
  genuine:
    "Assalam-o-alaikum, mujhe apne Reena product ki warranty / asli hone ki tasdeeq karni hai.",
};

export const DEMO_TOAST = "Demo preview: yeh feature final website mein chalega.";
