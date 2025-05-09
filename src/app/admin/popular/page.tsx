import { fetchPopular } from "@/features/films/server/db/films";
//import SearchFilm from "../_components/SearchFilm";
//import { Suspense } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import Modal from "@/components/modal";
import FeaturedFilms from "../_components/FeaturedFilms";
import Image from "next/image";
import { posterURL } from "@/lib/utils";

const page = async (props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query;

  const data = await fetchPopular();
  let popularFilm = data || [];

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
            <ul className="grid md:grid-cols-6 gap-2 relative">
              {popularFilm?.map((film, index) => (
                <li
                  key={index}
                  className="relative flex flex-col items-start gap-0.5"
                >
                  <div className=" h-[260px] w-full relative rounded">
                    <Image
                      src={
                        typeof film.posterImage === "string"
                          ? posterURL(film.posterImage)
                          : "/placeholder.webp"
                      }
                      fill
                      className="object-cover rounded"
                      alt={film.title}
                    />
                    {/*<DeleteBtn tmdbId={film.tmdbId} />*/}
                  </div>
                  <p className="text-sm font-medium line-clamp-1">
                    {film.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default page;
