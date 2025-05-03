import { HeroCarousel } from "@/components/HeroCarousel";

export default async function Home() {
  return (
    <div className="w-full no-scrollbar">
      <main>
        <HeroCarousel />
      </main>
    </div>
  );
}
