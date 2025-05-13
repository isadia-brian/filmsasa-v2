import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import Modal from "@/components/modal";
import FeaturedFilms from "../_components/FeaturedFilms";
import { carouselFilms } from "@/data/carousel";
import Image from "next/image";
import DeleteBtn from "../_components/FeaturedFilms/DeleteBtn";
import { fetchCarouselAction } from "@/features/films/server/db/films";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  //const searchParams = await props.searchParams;
  //const query = searchParams?.query ?? "";

  const films = await fetchCarouselAction();

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
          <ul className="grid md:grid-cols-6 gap-2 relative">
            {films?.map((film, index) => (
              <li
                key={index}
                className="relative flex flex-col items-start gap-0.5"
              >
                <div className=" h-[260px] w-full relative rounded">
                  <Image
                    src={film.backdropImage}
                    fill
                    className="object-cover rounded"
                    alt={film.title}
                  />
                  <DeleteBtn tmdbId={film.tmdbId} />
                </div>
                <p className="text-sm font-medium line-clamp-1">{film.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SidebarInset>
  );
}
