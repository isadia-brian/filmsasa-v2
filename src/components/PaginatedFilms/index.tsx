import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { posterURL } from "@/lib/utils";
import { ClientPagination } from "../ClientPagination";
import dynamic from "next/dynamic";
import { PaginatedFilmsData } from "@/types/films";
import { getContentLink } from "@/lib/navigation";

const ImageWithSkeleton = dynamic(
  () => import("@/components/ImageWithSkeleton")
);

const PaginatedFilms = ({
  allFilms,
  totalCount,
  currentPage,
  pageSize,
  media_type,
}: {
  allFilms: PaginatedFilmsData[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  media_type?: "movie" | "tv" | "kids";
}) => {
  return (
    <div className="text-white w-full min-h-[70vh] relative" id="top">
      <ul className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4">
        {allFilms?.map((item, index: number) => {
          const link = media_type ? getContentLink(media_type, item.id) : "/";

          return (
            <li
              key={index}
              className="transition ease-in-out flex flex-col gap-2 cursor-pointer md:hover:-translate-y-5 "
            >
              <Link
                prefetch={false}
                href={link}
                className="relative flex flex-col space-y-3"
              >
                <div
                  className="relative h-[160px] md:h-[240px] lg:h-[290px] rounded-lg hover:rounded-md"
                  id="link"
                >
                  {typeof item.poster_path === "string" ? (
                    <ImageWithSkeleton
                      src={posterURL(item.poster_path)}
                      alt={
                        typeof item.title === "string"
                          ? item.title
                          : typeof item.name === "string"
                          ? item.name
                          : ""
                      }
                      fill
                      className="object-cover rounded-md"
                      quality={70}
                      priority={index < 12}
                      loading={index >= 12 ? "lazy" : "eager"}
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  ) : (
                    <div className="bg-neutral-700 w-full h-full rounded-md" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-xs md:line-clamp-1 lg:text-[13px] font-semibold">
                    {item.title || item.name}
                  </p>
                  <div className="flex items-center justify-between text-white font-medium">
                    <p className={`text-[11px] leading-4`}>{item.year}</p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-[13px] w-[13px]" />

                      <div className="flex items-center gap-1">
                        <Star className="h-[13px] w-[13px]" fill="yellow" />
                        <p className={`text-[11px] leading-4"`}>
                          {item.vote_average}
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
