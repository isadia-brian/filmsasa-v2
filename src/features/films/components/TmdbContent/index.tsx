"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import SeasonEpisode from "./SeasonEpisode";
import { ScrollButtons } from "@/components/ScrollButtons";
import { FilmDetails } from "@/types/films";

const ActorCard = dynamic(() => import("./ActorCard"));
const RecommendedCard = dynamic(() => import("./RecommendedCard"), {
  ssr: false,
});
const YoutubePlayer = dynamic(() => import("../YoutubePlayer"), { ssr: false });

const TmdbContent = ({
  tmdbId,
  trailerOpen,
  toggleYoutube,
  cast,
  title,
  recommendations,
  video,
  seriesData,
}: {
  media: string;
  tmdbId: number;
  trailerOpen: boolean;
  toggleYoutube: () => void;
  title: string;
  cast: FilmDetails["cast"];
  recommendations: FilmDetails["recommendations"];
  video: FilmDetails["video"];
  seriesData: FilmDetails["seriesData"];
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollRecommendationsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      {seriesData && seriesData.seasons && (
        <SeasonEpisode
          seasons={seriesData.seasons}
          seriesData={seriesData.episodes}
          tmdbId={tmdbId}
        />
      )}
      {cast && cast.length > 0 && (
        <div className="text-white relative px-4  pt-10 pb-12 border-b-[0.5px] border-slate-400 ">
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-[17px] font-bold">Cast</h5>
            {cast.length > 10 && (
              <ScrollButtons scrollContainerRef={scrollContainerRef} />
            )}
          </div>

          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-4 md:space-x-3 overflow-x-scroll no-scrollbar"
          >
            {cast.map((actor, index) => (
              <ActorCard actor={actor} key={index} />
            ))}
          </div>
        </div>
      )}
      <div className="text-white relative px-4 pt-10 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h5 className="text-[17px] font-bold">Recommendations</h5>

          <ScrollButtons scrollContainerRef={scrollRecommendationsRef} />
        </div>
        <div
          ref={scrollRecommendationsRef}
          className="flex items-center space-x-3 lg:space-x-5 overflow-x-scroll no-scrollbar"
        >
          {recommendations && (
            <>
              {recommendations.map(
                ({
                  id,
                  title,
                  name,
                  backdrop_path,
                  media_type,
                }: {
                  id: number;
                  title?: string;
                  name?: string;
                  backdrop_path: string;
                  media_type: string;
                }) => (
                  <RecommendedCard
                    id={id}
                    key={id}
                    title={title}
                    name={name}
                    backdrop_path={backdrop_path}
                    media={media_type}
                  />
                ),
              )}
            </>
          )}
        </div>
      </div>
      {trailerOpen && video && (
        <YoutubePlayer
          videoId={video.videoId}
          officialTrailer={video.trailerUrl}
          toggleYoutube={toggleYoutube}
          title={title}
        />
      )}
    </div>
  );
};

export default TmdbContent;
