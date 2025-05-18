import Filter from "@/components/Filter";
import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";
import {
  fetchFilms,
  searchFilmByName,
} from "@/features/tmdb/server/actions/films";

const Movies = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  let pageSize = 24;

  let { allFilms: movies, totalCount } = await fetchFilms("movie");

  let films = movies
    .map((film) => {
      return {
        title: film.title,
        poster_path: film.poster_path,
        id: film.id,
        year: parseInt(film.release_date.split("-")[0]),
        vote_average: film.vote_average,
      };
    })
    .filter((film) => film.year < 2026);

  films.sort((a, b) => b.year - a.year);

  const firstItemIndex = (currentPage - 1) * pageSize;
  const lastItemIndex = firstItemIndex + pageSize;
  let currentFilms = films?.slice(firstItemIndex, lastItemIndex);

  const query = searchParams?.query || "";

  if (query) {
    const data = await searchFilmByName("movie", query.toLowerCase());
    currentFilms = data;
    pageSize = 0;
    //Recalculate totalCount after client side filtering if needed
    totalCount = movies.length;
  }
  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Movies" />
      <Filter filmType="movies" />
      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={currentFilms}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          media_type="movie"
        />
      </Suspense>
    </div>
  );
};

export default Movies;
