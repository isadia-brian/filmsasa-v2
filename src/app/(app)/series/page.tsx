import Filter from "@/components/Filter";
import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";
import {
  fetchFilms,
  searchFilmByName,
} from "@/features/tmdb/server/actions/films";

const Series = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  let currentPage = Number(searchParams?.page) || 1;
  let pageSize = 24;

  let { allFilms: series, totalCount } = await fetchFilms("tv");

  const firstItemIndex = (currentPage - 1) * pageSize;
  const lastItemIndex = firstItemIndex + pageSize;
  let currentFilms = series?.slice(firstItemIndex, lastItemIndex);

  const query = searchParams?.query || "";

  if (query) {
    const data = await searchFilmByName("tv", query.toLowerCase());
    currentFilms = data;
    pageSize = 0;
    totalCount = series.length;
  }

  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Series" />
      <Filter filmType="series" />
      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={currentFilms}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          media_type="tv"
        />
      </Suspense>
    </div>
  );
};

export default Series;
