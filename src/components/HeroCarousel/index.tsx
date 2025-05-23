import { Slider } from "./Slider";
import { HeroMovieCard } from "./HeroMovieCard";
import { fetchCarouselFilms } from "@/features/films/server/db/films";
import { bufferToDataURL } from "@/lib/utils";

export const HeroCarousel = async () => {
  const { films } = await fetchCarouselFilms();

  const filmsWithDataUrls = films?.map((film) => ({
    ...film,
    genres: JSON.parse(film.genres),
    backdropImage: bufferToDataURL(film.backdropImage as Uint8Array),
    posterImage: bufferToDataURL(film.posterImage as Uint8Array),
  }));

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
      {filmsWithDataUrls?.map((film, index: number) => (
        <HeroMovieCard film={film} key={film.tmdbId} priorityLoad={index < 4} />
      ))}
    </Slider>
  );
};
