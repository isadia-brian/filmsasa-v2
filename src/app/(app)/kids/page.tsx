import PageTitle from "@/components/PageTitle";
import PaginatedFilms from "@/components/PaginatedFilms";
import { fetchKids } from "@/features/films/server/db/films";
import { Suspense } from "react";
import FilmPagesLoader from "@/components/Loaders/FilmPages";

const Kids = async (props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;

  let { data: kids, totalCount } = await fetchKids(currentPage, pageSize);
  const query = searchParams?.query || "";

  if (query) {
    kids = kids.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase()),
    );
    //Recalculate totalCount after client side filtering if needed
    totalCount = kids.length;
  }
  return (
    <div className="w-full pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title="Kids" />

      <Suspense fallback={<FilmPagesLoader />}>
        <PaginatedFilms
          allFilms={kids}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
};

export default Kids;
