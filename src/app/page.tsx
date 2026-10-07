import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryRail from "@/components/home/CategoryRail";
import VoltageSimulator from "@/components/home/VoltageSimulator";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import ApplicationsGrid from "@/components/home/ApplicationsGrid";
import SunToSocket from "@/components/home/SunToSocket";
import MadeByReena from "@/components/home/MadeByReena";
import Dealers from "@/components/home/Dealers";
import GenuineTeaser from "@/components/home/GenuineTeaser";
import FaqList from "@/components/home/FaqList";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryRail />
      <VoltageSimulator />
      <ProductSpotlight />
      <ApplicationsGrid />
      <SunToSocket />
      <MadeByReena />
      <Dealers />
      <GenuineTeaser />
      <FaqList />
      <FinalCta />
    </>
  );
}
