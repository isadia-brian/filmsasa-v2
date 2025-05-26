import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import Modal from "@/components/modal";
import FeaturedFilms from "../_components/FeaturedFilms";
import { fetchCarouselFilms } from "@/features/films/server/db/films";
import { convertFilms } from "@/lib/utils";
import FilmGrid from "../_components/FeaturedFilms/FilmGrid";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";

  const { films } = await fetchCarouselFilms();
  const filmsWithDataUrls = convertFilms(films);

  let carouselFilms = filmsWithDataUrls || [];

  if (query && carouselFilms.length > 2) {
    carouselFilms = carouselFilms.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return (
    <SidebarInset>
      <SideBarInsetHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] px-4 py-5 flex-1 rounded-xl md:min-h-[100vh]">
          <div className="mb-4">
            <Modal>
              <FeaturedFilms title="Add to carousel" category="carousel" />
            </Modal>
          </div>
          <FilmGrid films={carouselFilms} category="carousel" />
        </div>
      </div>
    </SidebarInset>
  );
}
