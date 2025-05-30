import { HeroCarousel } from "@/components/HeroCarousel";
import CategoryGrid from "@/components/sections/SectionTwoGrid";
import NetworkProviders from "@/components/sections/NetworkProviders";
import { Suspense } from "react";
import SectionFilter from "@/components/sections/SectionOneGrid";
import { getUser } from "@/lib/dal";

export default async function Home() {
  const isUser = await getUser();
  const user = isUser ?? null;

  return (
    <div className="w-full no-scrollbar">
      <main>
        <HeroCarousel user={user} />
        <NetworkProviders />
        <Suspense>
          <SectionFilter user={user} />
        </Suspense>
        <CategoryGrid />
      </main>
    </div>
  );
}
