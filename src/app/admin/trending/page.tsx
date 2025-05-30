import { fetchTrending } from "@/features/films/server/db/films";
import { SidebarInset } from "@/components/ui/sidebar";
import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import Modal from "@/components/modal";
import FeaturedFilms from "../_components/FeaturedFilms";
import FilmGrid from "../_components/FeaturedFilms/FilmGrid";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

const page = async (props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) => {
  const user = await getUser();

  if (user?.role !== "admin") {
    redirect("/unauthorized");
  }

  const searchParams = await props.searchParams;
  const query = searchParams?.query;

  const { films } = await fetchTrending();

  let trendingFilm = films || [];

  if (query) {
    trendingFilm = trendingFilm.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return (
    <div className="w-full">
      <SidebarInset>
        <SideBarInsetHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
          <div className="bg-muted/50 min-h-[100vh] px-4 py-5 flex-1 rounded-xl md:min-h-[100vh] w-full">
            <div className="mb-4">
              <Modal>
                <FeaturedFilms title="Add to trending" category="trending" />
              </Modal>
            </div>
            <FilmGrid films={trendingFilm} category="trending" />
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default page;
