import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import SeedButton from "../_components/SeedButton";
import { fetchSeries } from "@/features/films/server/actions/films";
import AdminPaginatedFilms from "../_components/AdminPaginatedFilms";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;
  let { data } = await fetchSeries(currentPage, pageSize);
  let tvFilms = data || [];

  const query = searchParams?.query || "";

  if (query) {
    tvFilms = tvFilms.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase()),
    );
  }
  return (
    <SidebarInset>
      <SideBarInsetHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] px-4 py-5 flex-1 rounded-xl md:min-h-min">
          <div className="mb-4">
            <SeedButton contentType="tv" />
          </div>
          <AdminPaginatedFilms allFilms={tvFilms} />
        </div>
      </div>
    </SidebarInset>
  );
}
