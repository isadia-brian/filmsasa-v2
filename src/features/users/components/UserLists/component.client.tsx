"use client";

//import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteFilmBtn from "./DeleteFilmBtn";
import { posterURL } from "@/lib/utils";

interface UserListProps {
  title: string;
  films: {
    title: string;
    posterImage: string | null;
    mediaType: "movie" | "tv";
    tmdbId: number;
    tmdbPosterUrl: string | null;
  }[];
  userId: number;
  action: "favorites" | "watchlist";
}

const UserList = ({ title, films, action, userId }: UserListProps) => {
  //const scrollWatchListContainer = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm">({films.length})</p>
      </div>
      <div className=" flex flex-col gap-2 w-full">
        <div className="flex w-full items-center justify-end gap-[6px]">
          <Button
            size={"icon"}
            className="h-8 w-8 rounded-full flex items-center bg-neutral-600 justify-center cursor-pointer"
          >
            <ChevronLeft color="white" size={24} />
          </Button>
          <Button
            size={"icon"}
            className="h-8 w-8 rounded-full flex bg-neutral-600 items-center justify-center cursor-pointer"
          >
            <ChevronRight color="white" size={24} />
          </Button>
        </div>

        <div className=" relative w-full overflow-x-scroll no-scrollbar flex space-x-2">
          {films?.map(
            (
              { title, posterImage, tmdbPosterUrl, mediaType, tmdbId },
              index
            ) => (
              <div className="relative w-[130px]" key={index}>
                <Link
                  href={{
                    pathname: "/watch",

                    query: { media: mediaType, id: tmdbId },
                  }}
                  className="w-full flex flex-col gap-1"
                  prefetch={false}
                >
                  <div className="relative h-[190px] rounded-lg w-full">
                    <Image
                      src={
                        typeof posterImage === "string"
                          ? posterImage
                          : typeof tmdbPosterUrl === "string"
                          ? posterURL(tmdbPosterUrl)
                          : "/placeholder.webp"
                      }
                      alt={typeof title === "string" ? title : ""}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-sm leading-[1.2] w-full line-clamp-2">
                    {title}
                  </p>
                </Link>
                <DeleteFilmBtn
                  userId={userId}
                  filmTitle={title}
                  action={action}
                  tmdbId={tmdbId}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
