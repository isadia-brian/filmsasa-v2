"use client";

import { useEffect, useState } from "react";
import { fetchContent } from "@/features/tmdb/server/actions/films";
import dynamic from "next/dynamic";
import SeasonEpisode from "./SeasonEpisode";

const ActorCard = dynamic(() => import("./ActorCard"));
const RecommendedCard = dynamic(() => import("./RecommendedCard"), {
  ssr: false,
});
const YoutubePlayer = dynamic(() => import("../YoutubePlayer"), { ssr: false });

const TmdbContent = ({
  media,
  tmdbId,
  trailerOpen,
  toggleYoutube,
  title,
}: {
  media: string;
  tmdbId: number;
  trailerOpen: boolean;
  toggleYoutube: () => void;
  title: string;
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<number | null>(null);
  const [seriesData, setSeriesData] = useState<any[]>();

  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchContent(tmdbId, media);
      const {
        recommendations,
        cast,
        trailerUrl: url,
        video_id,
        seasons,
        seriesData: episodes,
      } = results;
      setCast(cast);
      setRecommendations(recommendations);
      setTrailerUrl(url);
      setVideoId(video_id);
      setSeasons(seasons);
      setSeriesData(episodes);
    };
    fetchData();
  }, []);

  return (
    <div>
      {seasons && (
        <SeasonEpisode
          seasons={seasons}
          seriesData={seriesData}
          tmdbId={tmdbId}
        />
      )}
      {cast && cast.length > 0 && (
        <div className="text-white relative px-4  pt-10 pb-12 border-b-[0.5px] border-slate-400 ">
          <h5 className="text-[17px] font-bold mb-6">Cast</h5>

          <div className="flex items-center space-x-4 md:space-x-3 overflow-x-scroll no-scrollbar">
            {cast.map((actor, index) => (
              <ActorCard actor={actor} key={index} />
            ))}
          </div>
        </div>
      )}
      <div className="text-white relative px-4  pt-10 pb-12  ">
        <h5 className="text-[17px] font-bold mb-8">Recommendations</h5>
        <ul className="flex items-center space-x-3 lg:space-x-5 overflow-x-scroll no-scrollbar">
          {recommendations?.map(
            ({
              title,
              name,
              backdrop_path,
              id,
            }: {
              title: string;
              name: string;
              backdrop_path: string;
              id: number;
            }) => (
              <RecommendedCard
                id={id}
                title={title}
                name={name}
                backdrop_path={backdrop_path}
                key={id}
                media={media}
              />
            ),
          )}
        </ul>
      </div>
      {trailerOpen && (
        <YoutubePlayer
          videoId={videoId}
          officialTrailer={trailerUrl}
          toggleYoutube={toggleYoutube}
          title={title}
        />
      )}
    </div>
  );
};

export default TmdbContent;
