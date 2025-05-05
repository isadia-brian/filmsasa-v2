import { ClientPagination } from "@/components/ClientPagination";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import PageTitle from "@/components/PageTitle";
import { fetchProvider } from "@/features/tmdb/server/actions/films";
import { providerDetails } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Film = {
  poster_path: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  vote_average: number;
  first_air_date?: string;
  id: number;
};

type params = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string; media_type?: string }>;
const page = async (props: { searchParams: SearchParams; params: params }) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug } = params;

  const media_type = searchParams.media_type || "movie";
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 24;

  const { providerId, providerTitle } = providerDetails(slug);

  const { allFilms, totalCount } = await fetchProvider(media_type, providerId);
  const films = allFilms || [];
  const firstItemIndex = (currentPage - 1) * itemsPerPage;
  const lastItemIndex = firstItemIndex + itemsPerPage;
  const currentFilms = films?.slice(firstItemIndex, lastItemIndex);

  const links = [
    {
      name: "movies",
      media_type: "movie",
      link: `/providers/${slug}`,
    },
    {
      name: "series",
      media_type: "tv",
      link: `/providers/${slug}`,
    },
  ];

  let categoryType: string = "";

  switch (media_type) {
    case "movies":
      categoryType = "movies";
      break;
    case "tv":
      categoryType = "series";
    default:
      break;
  }

  return (
    <div className="w-full min-h-screen pt-[80px] md:pt-[100px] pb-[50px] px-4 text-slate-200">
      <PageTitle title={providerTitle} />
      <div className="mb-4 flex gap-4 items-center">
        {links.map(
          ({
            name,
            link,
            media_type,
          }: {
            name: string;
            link: string;
            media_type: string;
          }) => (
            <Link
              key={name}
              href={{ pathname: link, query: { media_type: media_type } }}
              className="flex items-center justify-center gap-2 cursor-pointer border border-slate-100 bg-slate-100 w-[140px]  py-2 text-slate-900 text-sm "
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          ),
        )}
      </div>

      <Suspense fallback={<p>Loading</p>}>
        <ul
          className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4"
          id="top"
        >
          {currentFilms?.map((film: Film, index: number) => (
            <li
              key={film.id}
              className="transition ease-in-out min-w-[100px] flex flex-col gap-2 lg:col-span-2 cursor-pointer md:hover:-translate-y-5 "
            >
              <Link
                prefetch={false}
                href={`/${categoryType}/${film.id}`}
                className="relative flex flex-col space-y-3"
              >
                <div
                  className="relative h-[160px]  md:h-[240px]   lg:h-[280px]  rounded-lg hover:rounded-md"
                  id="link"
                >
                  <ImageWithSkeleton
                    src={
                      typeof film.poster_path === "string"
                        ? `https://image.tmdb.org/t/p/w342/${film.poster_path}`
                        : "/placeholder.webp"
                    }
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 200px, 342px"
                    alt={
                      typeof film.title === "string"
                        ? film.title
                        : typeof film.name === "string"
                          ? film.name
                          : ""
                    }
                    fill
                    className="object-cover rounded-md"
                    quality={75}
                    priority={index < 12 ? true : false}
                    loading={index >= 12 ? "lazy" : "eager"}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-xs md:line-clamp-1 lg:text-[13px] font-semibold">
                    {film.title || film.name}
                  </p>
                  <div className="flex items-center justify-between text-white font-medium">
                    <p className={`text-[11px] leading-4`}>
                      {
                        (film.release_date || film.first_air_date)?.split(
                          "-",
                        )[0]
                      }
                    </p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-[13px] w-[13px]" />

                      <div className="flex items-center gap-1">
                        <Star className="h-[13px] w-[13px]" fill="yellow" />
                        <p className={`text-[11px] leading-4"`}>
                          {Math.round(film.vote_average)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <ClientPagination
          itemsPerPage={itemsPerPage}
          totalItems={totalCount}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
};

export default page;
