import { Slider } from "./Slider";
import { HeroMovieCard } from "./HeroMovieCard";
import { fetchCarouselFilms } from "@/features/films/server/db/films";
import { getUser } from "@/lib/dal";

export const HeroCarousel = async () => {
  const { films: data } = await fetchCarouselFilms();
  const user = await getUser();
  const userId = user?.id;
  const films = data;

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
      {films?.map((film, index: number) => (
        <HeroMovieCard
          film={film}
          key={film.tmdbId}
          priorityLoad={index < 4}
          userId={userId}
        />
      ))}
    </Slider>
  );
};
