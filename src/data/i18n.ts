export type Lang = "en" | "ur";

export const strings = {
  "nav.products": { en: "Products", ur: "پروڈکٹس" },
  "nav.solar": { en: "Solar", ur: "سولر" },
  "nav.dealers": { en: "Dealers", ur: "ڈیلرز" },
  "nav.genuine": { en: "Genuine check", ur: "اصل کی پہچان" },
  "nav.contact": { en: "Contact", ur: "رابطہ" },
  "hero.h1": {
    en: "Steady power. Made in Pakistan.",
    ur: "مستحکم بجلی۔ پاکستان میں تیار۔",
  },
  "hero.urdu": { en: "", ur: "بجلی جیسی بھی ہو، حفاظت رینا کی" },
  "cta.products": { en: "Explore products", ur: "پروڈکٹس دیکھیں" },
  "cta.dealer": { en: "Become a dealer", ur: "ڈیلر بنیں" },
  "cta.whatsapp": { en: "WhatsApp karein", ur: "واٹس ایپ کریں" },
  "cta.call": { en: "Call karein", ur: "کال کریں" },
  "cat.stabilizers": { en: "Voltage Stabilizers", ur: "وولٹیج اسٹیبلائزر" },
  "cat.inverters": { en: "Solar Inverters", ur: "سولر انورٹر" },
  "cat.mppt": { en: "MPPT & Solar Chargers", ur: "ایم پی پی ٹی اور سولر چارجر" },
  "cat.wires": { en: "Electrical Wires", ur: "بجلی کی تاریں" },
  "s3.h2": {
    en: "Four product lines. One brand you can trust.",
    ur: "چار پروڈکٹ لائنز، ایک بھروسہ",
  },
  "s4.h2": {
    en: "See what a stabilizer does.",
    ur: "اسٹیبلائزر کیا کرتا ہے؟ خود دیکھیں",
  },
  "s4.with": { en: "With Reena", ur: "رینا کے ساتھ" },
  "s4.without": { en: "Without stabilizer", ur: "اسٹیبلائزر کے بغیر" },
  "s4.protected": { en: "Protected", ur: "محفوظ" },
  "s6.h2": { en: "Wherever power matters.", ur: "جہاں بجلی ضروری ہے، وہاں رینا" },
  "app.homes": { en: "Homes", ur: "گھر" },
  "app.fridge": { en: "Refrigerators", ur: "فریج" },
  "app.ac": { en: "Air Conditioners", ur: "اے سی" },
  "app.offices": { en: "Offices", ur: "دفاتر" },
  "app.industrial": { en: "Commercial & Industrial", ur: "کاروبار اور فیکٹریاں" },
  "app.solar": { en: "Solar Systems", ur: "سولر سسٹم" },
  "s7.h2": {
    en: "From sun to socket, Reena all the way.",
    ur: "سورج سے ساکٹ تک، سب رینا",
  },
  "s8.h2": { en: "Made in our own facility.", ur: "رینا کی اپنی تیاری" },
  "s9.h2": { en: "Sell Reena in your city.", ur: "اپنے شہر میں رینا کے ڈیلر بنیں" },
  "s10.h2": { en: "Is your Reena genuine?", ur: "اصل رینا کی پہچان کریں" },
  "s12.h2": { en: "Talk to Reena.", ur: "رینا سے بات کریں" },
  "products.h1": { en: "Products", ur: "پروڈکٹس" },
  "dealers.h1": { en: "Become a Reena dealer.", ur: "رینا ڈیلر بنیں" },
  "genuine.h1": { en: "Check your Reena product.", ur: "اپنی پروڈکٹ کی تصدیق کریں" },
  "footer.urduNote": { en: "", ur: "مکمل اردو ورژن فائنل ویب سائٹ میں" },
} as const;

export type StringKey = keyof typeof strings;

export const t = (key: StringKey, lang: Lang) => {
  const entry = strings[key];
  const val = entry[lang];
  return val || entry.en;
};
