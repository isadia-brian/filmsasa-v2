import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";
import { fetchFilms } from "@/features/tmdb/server/actions/films";

const Kids = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;

  let { data: kids, totalCount } = await fetchFilms("kids");

  let films = kids || [];

  films.sort((a, b) => b.year - a.year);

  const firstItemIndex = (currentPage - 1) * pageSize;
  const lastItemIndex = firstItemIndex + pageSize;
  const currentFilms = films?.slice(firstItemIndex, lastItemIndex);

  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Kids" />

      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={currentFilms}
          totalCount={totalCount}
          currentPage={currentPage}
          media_type="kids"
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
};

export default Kids;
