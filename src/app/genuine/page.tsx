import type { Metadata } from "next";
import { Suspense } from "react";
import GenuinePage from "@/components/pages/GenuinePage";

export const metadata: Metadata = {
  title: "Genuine check",
  description: "Check that your Reena product is genuine.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-night" />}>
      <GenuinePage />
    </Suspense>
  );
}
