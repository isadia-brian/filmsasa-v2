import { HeroCarousel } from "@/components/HeroCarousel";
//import CategoryGrid from "@/components/sections/SectionTwoGrid";
import NetworkProviders from "@/components/sections/NetworkProviders";
import { Suspense } from "react";
import SectionFilter from "@/components/sections/SectionOneGrid";

export default async function Home() {
  return (
    <div className="w-full no-scrollbar">
      <main>
        <HeroCarousel />
        <NetworkProviders />
        <Suspense>
          <SectionFilter />
        </Suspense>
        {/*<CategoryGrid />*/}
      </main>
    </div>
  );
}
