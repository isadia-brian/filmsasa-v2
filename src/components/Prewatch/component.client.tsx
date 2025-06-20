"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aquire } from "@/app/fonts";
import { FavoriteBtn, WatchListBtn } from "./ActionBtns";

const TmdbContent = dynamic(
  () => import("../../features/films/components/TmdbContent")
);

const PrewatchClient = (props: {
  film: any;
  kidsPage?: boolean;
  userId?: number;
}) => {
  const { film, kidsPage, userId } = props;

  const [trailerOpen, setTrailerOpen] = useState(false);

  const {
    title,
    tmdbId,
    year,
    overview,
    backdropImage,
    posterImage,
    genres,
    recommendations,
    video,
    mediaType,
    seriesData,
    cast,
    runtime,
  } = film;

  const buttonData = {
    userId,
    title,
    mediaType,
    posterImage,
    tmdbId,
  };

  const duration = useMemo(() => {
    if (runtime) return runtime;
    return seriesData?.seasons === 1
      ? "1 season"
      : `${seriesData?.seasons} seasons`;
  }, [runtime, seriesData]);

  const genresText = useMemo(() => {
    const firstThreeGenres = genres.slice(0, 3);
    return firstThreeGenres.length > 1
      ? firstThreeGenres.join(" - ")
      : firstThreeGenres[0] || "";
  }, [genres]);

  const toggleYoutube = useCallback(() => {
    setTrailerOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`relative w-full ${
        trailerOpen ? "h-screen overflow-hidden " : "min-h-screen overflow-auto"
      }`}
    >
      <div
        className={`relative w-full flex flex-col justify-center ${
          kidsPage ? "h-[100vh]" : "h-[70vh] md:h-[80vh]"
        }`}
      >
        <div className="relative h-full w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${backdropImage}`}
            alt={title}
            fill
            quality={kidsPage ? 100 : 80}
            className="object-cover"
            priority={true}
            loading="eager"
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </div>
        <div className="absolute flex flex-col space-y-12 h-full w-full overflow-x-hidden left-0 bg-linear-to-tl from-black/60 via-black/30 to-black/60 text-white pt-[100px] md:pt-[150px] pb-4 px-4">
          <div className="w-full flex justify-between items-center z-[1000]">
            <h4
              className={`${aquire.className} text-4xl md:text-7xl max-w-[250px] md:max-w-[500px]`}
            >
              {title}
            </h4>
            <FavoriteBtn {...buttonData} />
          </div>

          <div className="md:absolute md:z-[1500]  md:h-full md:top-0  flex items-center justify-center md:left-[50%] md:-translate-x-1/2 md:w-fit">
            <Link
              prefetch={false}
              href={{
                pathname: `/watch`,
                query: { media: mediaType, id: film?.tmdbId },
              }}
              className="border-2 animate-pulse flex items-center justify-center border-red-500 rounded-full h-14 w-14 md:h-24 md:w-24"
            >
              <PlayIcon
                className="text-white-500 h-5 w-5 md:h-7 md:w-7"
                fill="white"
              />
            </Link>
          </div>
          <div className="w-full md:w-fit md:absolute md:bottom-[40px] md:right-4">
            <div className="flex flex-col gap-2 pr-2 ">
              <div className="text-xs md:text-sm flex items-center gap-2">
                <p>{year}</p>
                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <div>
                  <p className="flex items-center gap-2">
                    <span>{duration}</span>
                  </p>
                </div>

                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <p className="capitalize">{mediaType}</p>

                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <div className="flex items-center gap-1">{genresText}</div>
              </div>
              <p className="max-w-[500px] leading-tight line-clamp-6">
                {overview}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center md:items-end md:absolute md:bottom-0 md:pb-[90px]">
            <button
              type="button"
              onClick={toggleYoutube}
              className="transition-colors flex items-center justify-center gap-2  bg-red-500 py-1.5 md:py-2 w-[120px] md:w-[140px] uppercase cursor-pointer border border-red-500 text-sm hover:bg-white hover:text-black hover:border-white"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </span>
              Watch Trailer
            </button>
            <WatchListBtn {...buttonData} />
          </div>
        </div>
      </div>
      {!kidsPage && (
        <TmdbContent
          media={mediaType}
          tmdbId={tmdbId}
          cast={cast}
          recommendations={recommendations}
          seriesData={seriesData}
          video={video}
          trailerOpen={trailerOpen}
          toggleYoutube={toggleYoutube}
          title={title}
        />
      )}
    </div>
  );
};

export default PrewatchClient;
