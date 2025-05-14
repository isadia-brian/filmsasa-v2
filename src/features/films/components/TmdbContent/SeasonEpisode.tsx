"use client";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { useState } from "react";

const SeasonEpisode = ({
  seasons,
  seriesData,
}: {
  seasons: number;
  seriesData?: any[];
}) => {
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const filteredEpisodes =
    seriesData?.filter((episode) => episode.season_number === activeSeason) ||
    [];

  return (
    <div className="flex flex-col py-10 px-4 gap-4 font-semibold border-b-[0.5px] border-slate-400">
      <div className=" flex items-center gap-4">
        {Array.from({ length: seasons }, (_, i) => {
          const seasonNumber = i + 1;
          return (
            <button
              key={i}
              onClick={() => setActiveSeason(seasonNumber)}
              className={`pb-2 ${
                activeSeason === seasonNumber
                  ? "border-b-2 border-blue-500"
                  : ""
              }`}
            >
              Season {seasonNumber}
            </button>
          );
        })}
      </div>

      <div>
        <ul className="flex items-center space-x-3 lg:space-x-5 overflow-x-scroll no-scrollbar">
          {filteredEpisodes?.map((episode) => (
            <li key={episode.id}>
              <Link href={"#"} className="space-y-1">
                <div className="relative h-[110px] w-[200px] md:w-[260px] md:h-[150px] rounded-lg bg-white hover:cursor-default">
                  <ImageWithSkeleton
                    src={
                      typeof episode.still_path === "string"
                        ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                        : "/placeholder.webp"
                    }
                    alt={episode.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{episode.name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeasonEpisode;
