import type { Metadata } from "next";
import DealersPage from "@/components/pages/DealersPage";

export const metadata: Metadata = {
  title: "Become a dealer",
  description:
    "Stock a full power range from one manufacturer. Reena supplies dealers across Pakistan.",
};

export default function Page() {
  return <DealersPage />;
}
