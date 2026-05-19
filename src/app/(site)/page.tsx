import { HeroSection } from "@/components/hero/HeroSection";
import { HowWeTrainSection } from "@/components/home/HowWeTrainSection";
import { MomentumSection } from "@/components/home/MomentumSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowWeTrainSection />
      <MomentumSection />
    </div>
  );
}
