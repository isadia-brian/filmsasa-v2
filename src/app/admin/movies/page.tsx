import SideBarInsetHeader from "@/components/SideBarInsetHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import SeedButton from "../_components/SeedButton";
import { fetchMovies } from "@/features/films/server/actions/films";
import Image from "next/image";
import { posterURL } from "@/lib/utils";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 24;
  let { data } = await fetchMovies(currentPage, pageSize);
  let movieFilms = data || [];

  const query = searchParams?.query || "";

  if (query) {
    movieFilms = movieFilms.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase()),
    );
  }
  return (
    <SidebarInset>
      <SideBarInsetHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[100vh] px-4 py-5 flex-1 rounded-xl md:min-h-min">
          <div className="mb-4">
            <SeedButton contentType="movies" />
          </div>
          <ul className="grid md:grid-cols-6 gap-2 relative">
            {movieFilms?.map((film, index) => (
              <li
                key={index}
                className="relative flex flex-col items-start gap-0.5"
              >
                <div className=" h-[280px] w-full relative rounded">
                  <Image
                    src={posterURL(film.posterImage)}
                    fill
                    className="object-cover rounded"
                    alt={film.title}
                  />
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
