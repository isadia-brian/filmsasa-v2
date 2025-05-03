import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import PageTitle from "@/components/PageTitle";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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

async function getProvider(
  id: string,
  category: string | string[] | undefined,
): Promise<Film[]> {
  let tmdbCategory: string = "";
  switch (category) {
    case "series":
      tmdbCategory = "tv";
      break;

    case "movies":
      tmdbCategory = "movie";
      break;
    default:
      tmdbCategory = "movie";
      break;
  }

  const stringedId: string = id;

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/${tmdbCategory}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_original_language=en&with_watch_providers=${stringedId}&api_key=${process.env.TMDB_API_KEY}`,
  );

  const films = (await res.json()).results as Film[];
  if (!films || films.length === 0) return notFound();
  return films;
}

type params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const page = async ({
  params,
  searchParams,
}: {
  params: params;
  searchParams: SearchParams;
}) => {
  const { slug } = await params;

  const { category = "movies" } = await searchParams;

  let providerId: string = "";
  let providerTitle: string = "";

  switch (slug) {
    case "netflix":
      providerId = "8";
      providerTitle = "Netflix";
      break;
    case "apple-tv-plus":
      providerId = "350";
      providerTitle = "Apple TV+";
      break;
    case "amazon-prime-video":
      providerId = "9";
      providerTitle = "Amazon Prime";
      break;
    case "disney-plus":
      providerId = "337";
      providerTitle = "Disney+";
      break;
    case "hulu":
      providerId = "15";
      providerTitle = "Hulu";
      break;
    default:
      break;
  }
  const films: Film[] = await getProvider(providerId, category);

  const links = [
    {
      name: "movies",
      link: `/providers/${slug}`,
    },
    {
      name: "series",
      link: `/providers/${slug}`,
    },
  ];

  const categoryType = category;

  return (
    <div className="w-full min-h-screen pt-[120px] pb-[50px] px-4 text-slate-200">
      <PageTitle title={providerTitle} />
      <div className="mb-4 flex gap-4 items-center">
        {links.map(({ name, link }: { name: string; link: string }) => (
          <Link
            key={name}
            href={{ pathname: link, query: { category: name } }}
            className="bg-slate-100 px-6 py-1 text-slate-900 text-sm "
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Link>
        ))}
      </div>
      <Suspense fallback={<p>Loading</p>}>
        <ul className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4">
          {films?.map((film: Film, index: number) => (
            <li
              key={index}
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
                        : ""
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
                    priority={index < 6 ? true : false}
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
      </Suspense>
    </div>
  );
};

export default page;
