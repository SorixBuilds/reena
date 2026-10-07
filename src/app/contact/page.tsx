import type { Metadata } from "next";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Reena on WhatsApp, call, or visit Jan Electrical in Ghotki.",
};

export default function Page() {
  return <ContactPage />;
}
