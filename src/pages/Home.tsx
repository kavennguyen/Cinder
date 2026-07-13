import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TwoPathsSection from "../components/TwoPathsSection";
import InfoSection from "../components/InfoSection";
import BackedBySection from "../components/BackedBySection";
import UseCasesSection from "../components/UseCasesSection";

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <div className="relative">
        <Navbar />
        <HeroSection />
      </div>
      <BackedBySection />
      <TwoPathsSection />
      <InfoSection />
      <UseCasesSection />
    </div>
  );
}
