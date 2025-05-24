"use client";

import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { useState } from "react";

const SeasonEpisode = ({
  seasons,
  seriesData,
  tmdbId,
}: {
  seasons: number;
  seriesData?: any[];
  tmdbId: number;
}) => {
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const filteredEpisodes =
    seriesData?.filter((episode) => episode.season_number === activeSeason) ||
    [];

  return (
    <div className="flex flex-col py-10 px-4 gap-4 font-semibold border-b-[0.5px] border-slate-400 overflow-x-scroll w-full no-scrollbar">
      <div className=" flex items-center gap-4">
        {Array.from({ length: seasons }, (_, i) => {
          const seasonNumber = i + 1;
          return (
            <button
              key={i}
              onClick={() => setActiveSeason(seasonNumber)}
              className={`pb-2 text-sm  min-w-fit ${
                activeSeason === seasonNumber ? "border-b-2 border-red-500" : ""
              }`}
            >
              <span className=" inline-block">Season {seasonNumber}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full">
        <ul className="flex items-center space-x-3 lg:space-x-5">
          {filteredEpisodes?.map((episode) => (
            <li key={episode.id} className="cursor-pointer">
              <Link
                href={{
                  pathname: "/watch",
                  query: {
                    media: "tv",
                    id: tmdbId,
                    season: activeSeason,
                    episode: episode.episode_number,
                  },
                }}
                className="space-y-1.5"
              >
                <div className="relative h-[110px] w-[200px] md:w-[260px] md:h-[150px] rounded-lg bg-white hover:cursor-default">
                  <ImageWithSkeleton
                    src={
                      typeof episode.still_path === "string"
                        ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                        : "/placeholder.webp"
                    }
                    alt={episode.name}
                    fill
                    loading="lazy"
                    priority={false}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-xs font-light">
                    Episode: {episode.episode_number}
                  </p>
                  <p className="text-xs">{episode.name}</p>
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
