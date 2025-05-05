import Filter from "@/components/Filter";
import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { fetchSeries } from "@/features/films/server/db/films";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";

const Series = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;
  let { data: series, totalCount } = await fetchSeries(currentPage, pageSize);
  const query = searchParams?.query || "";

  if (query) {
    series = series.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
    totalCount = series.length;
  }

  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Series" />
      <Filter filmType="series" />
      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={series}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
};

export default Series;
