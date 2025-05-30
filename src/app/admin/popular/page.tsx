import { fetchPopular } from "@/features/films/server/db/films";
//import SearchFilm from "../_components/SearchFilm";
//import { Suspense } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import Modal from "@/components/modal";
import FeaturedFilms from "../_components/FeaturedFilms";
import FilmGrid from "../_components/FeaturedFilms/FilmGrid";

const page = async (props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query;

  const { films } = await fetchPopular();

  let popularFilm = films || [];

  if (query) {
    popularFilm = popularFilm.filter((film) =>
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
                <FeaturedFilms title="Add to popular" category="popular" />
              </Modal>
            </div>
            <FilmGrid films={popularFilm} category="popular" />
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default page;
