import { Slider } from "./Slider";
import { HeroMovieCard } from "./HeroMovieCard";
import { type Film } from "@/drizzle/schema";
import { fetchCarouselFilms } from "@/features/films/server/actions/films";
import { getUser } from "@/lib/dal";

export const HeroCarousel = async () => {
  const [initialData, user] = await Promise.all([
    fetchCarouselFilms(),
    getUser(),
  ]);

  const userId = user?.id ?? 0;

  return (
    <Slider
      showPagination
      autoPlay
      itemScrollSnapStopAlways
      itemsGap="clamp(12px, 9.09px + 0.777vw, 24px)"
      btnHoverVariant="scaleHover"
      hideOverflowItems
      observerOptions={{ rootMargin: "200px", threshold: [0.1, 0.5, 0.9] }}
    >
      {initialData?.map((film: Film, index: number) => (
        <HeroMovieCard
          film={film}
          key={film.tmdbId}
          userId={userId}
          priorityLoad={index < 4}
        />
      ))}
    </Slider>
  );
};
