import Link from "next/link";
import { Heart, Star } from "lucide-react";
import Pagination from "./Pagination";
import type { Film } from "@/drizzle/schema";
import { posterURL } from "@/lib/utils";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

const PaginatedFilms = ({
  allFilms,
  totalCount,
  currentPage,
  pageSize,
}: {
  allFilms: Film[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}) => {
  return (
    <div className="text-white w-full min-h-[70vh] relative" id="top">
      <ul className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4">
        {allFilms?.map((item: Film, index: number) => {
          let link: string = "";
          const categoryTitle = item?.contentType?.toLowerCase();
          switch (categoryTitle) {
            case "tv":
              link = `/series/${item.tmdbId}`;
              break;

            case "movie":
              link = `/movies/${item.tmdbId}`;
              break;

            case "kids":
              link = `/kids/${item.tmdbId}`;
              break;

            default:
              break;
          }
          return (
            <li
              key={index}
              className="transition ease-in-out min-w-[100px] flex flex-col gap-2 lg:col-span-2 cursor-pointer md:hover:-translate-y-5 "
            >
              <Link
                prefetch={true}
                href={link}
                className="relative flex flex-col space-y-3"
              >
                <div
                  className="relative h-[160px]  md:h-[240px]   lg:h-[280px]  rounded-lg hover:rounded-md"
                  id="link"
                >
                  <ImageWithSkeleton
                    src={
                      typeof item.posterImage === "string"
                        ? posterURL(item.posterImage)
                        : ""
                    }
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 200px, 342px"
                    alt={item.title}
                    fill
                    decoding="sync"
                    className="object-cover rounded-md"
                    quality={75}
                    priority={index < 6 ? true : false}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-xs md:line-clamp-1 lg:text-[13px] font-semibold">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-white font-medium">
                    <p className={`text-[11px] leading-4`}>{item.year}</p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-[13px] w-[13px]" />

                      <div className="flex items-center gap-1">
                        <Star className="h-[13px] w-[13px]" fill="yellow" />
                        <p className={`text-[11px] leading-4"`}>
                          {item.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div>
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage} // 1
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default PaginatedFilms;
