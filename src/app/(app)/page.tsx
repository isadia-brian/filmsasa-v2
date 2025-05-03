import { HeroCarousel } from "@/components/HeroCarousel";
import NetworkProviders from "@/components/sections/NetworkProviders";

export default async function Home() {
  return (
    <div className="w-full no-scrollbar">
      <main>
        <HeroCarousel />
        <NetworkProviders />
      </main>
    </div>
  );
}
