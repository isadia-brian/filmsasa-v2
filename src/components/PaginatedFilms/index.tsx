import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { posterURL } from "@/lib/utils";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { ClientPagination } from "../ClientPagination";

const PaginatedFilms = ({
  allFilms,
  totalCount,
  currentPage,
  pageSize,
  media_type,
}: {
  allFilms: any;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  media_type?: "movie" | "tv" | "kids";
}) => {
  return (
    <div className="text-white w-full min-h-[70vh] relative" id="top">
      <ul className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4">
        {allFilms?.map((item: any, index: number) => {
          let link: string = "";
          const categoryTitle = media_type;
          switch (categoryTitle) {
            case "tv":
              link = `/series/${item.id}`;
              break;

            case "movie":
              link = `/movies/${item.id}`;
              break;

            case "kids":
              link = `/kids/${item.id}`;
              break;

            default:
              break;
          }
          return (
            <li
              key={index}
              className="transition ease-in-out flex flex-col gap-2 cursor-pointer md:hover:-translate-y-5 "
            >
              <Link
                prefetch={true}
                href={link}
                className="relative flex flex-col space-y-3"
              >
                <div
                  className="relative h-[160px]  md:h-[240px]   lg:h-[290px]  rounded-lg hover:rounded-md"
                  id="link"
                >
                  <ImageWithSkeleton
                    src={
                      typeof item.poster_path === "string"
                        ? posterURL(item.poster_path)
                        : "/placeholder.webp"
                    }
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 200px, 342px"
                    alt={item.title || item.name}
                    fill
                    decoding="sync"
                    className="object-cover rounded-md"
                    quality={75}
                    priority={index < 6 ? true : false}
                    loading={index > 24 ? "lazy" : "eager"}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-xs md:line-clamp-1 lg:text-[13px] font-semibold">
                    {item.title || item.name}
                  </p>
                  <div className="flex items-center justify-between text-white font-medium">
                    <p className={`text-[11px] leading-4`}>
                      {parseInt(item.release_date?.split("-")[0]) ||
                        parseInt(item.first_air_date?.split("-")[0]) ||
                        item.year}
                    </p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-[13px] w-[13px]" />

                      <div className="flex items-center gap-1">
                        <Star className="h-[13px] w-[13px]" fill="yellow" />
                        <p className={`text-[11px] leading-4"`}>
                          {Math.round(item.vote_average)}
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
      {pageSize > 0 && (
        <div>
          <ClientPagination
            totalItems={totalCount}
            currentPage={currentPage}
            itemsPerPage={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedFilms;
