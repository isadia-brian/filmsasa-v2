import Filter from "@/components/Filter";
import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { fetchMovies } from "@/features/films/server/db/films";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";

const Movies = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;

  let { data: movies, totalCount } = await fetchMovies(currentPage, pageSize);
  const query = searchParams?.query || "";

  if (query) {
    movies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()),
    );
    //Recalculate totalCount after client side filtering if needed
    totalCount = movies.length;
  }
  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Movies" />
      <Filter filmType="movies" />
      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={movies}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
};

export default Movies;
