import { Slider } from "./Slider";
import { HeroMovieCard } from "./HeroMovieCard";
import { carouselFilms } from "@/data/carousel";
import { fetchCarouselAction } from "@/features/films/server/db/films";

export const HeroCarousel = async () => {
  const films = await fetchCarouselAction();

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
        <HeroMovieCard film={film} key={film.tmdbId} priorityLoad={index < 4} />
      ))}
    </Slider>
  );
};
