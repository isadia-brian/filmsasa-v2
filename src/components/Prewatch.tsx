"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PlayIcon, PlusIcon, Star, Youtube as Tube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aquire } from "@/app/fonts";

// import { addToWatchList } from "@/actions/watchList";
const TmdbContent = dynamic(
  () => import("../features/films/components/TmdbContent/"),
);
const Prewatch = (props: { film: any; kidsPage?: boolean }) => {
  const { film, kidsPage } = props;

  const [trailerOpen, setTrailerOpen] = useState(false);

  const {
    title,
    tmdbId,
    year,
    overview,
    backdropImage,
    genres,
    media_type,
    seasons,
    runtime,
  } = film;

  // TODO: remove
  const singleFilm: number = parseInt(tmdbId);

  const handleClick = async (individualFilm: number) => {
    console.log(individualFilm);
    // const response = await addToWatchList(userId, film);

    // if (response.status === 200) {
    // console.log("added to watchlist");
    // }
  };

  const toggleYoutube = () => {
    setTrailerOpen(!trailerOpen);
  };

  let duration: string = "";

  if (runtime) {
    duration = runtime;
  } else {
    duration = seasons === 1 ? "1 season" : `${seasons} seasons`;
  }

  return (
    <div
      className={`relative ${
        trailerOpen ? "h-screen overflow-hidden " : "min-h-screen overflow-auto"
      }`}
    >
      <div
        className={`relative flex flex-col justify-center ${kidsPage ? "h-[100vh]" : "h-[50vh] md:h-[90vh]"}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${backdropImage}`}
            alt={title}
            fill
            quality={70}
            className="object-cover"
            priority={true}
            sizes="
          (max-width: 768px) 100vw,1280px
        "
          />
        </div>
        <div className="absolute h-full w-full left-0 bg-linear-to-tl from-black/60 via-black/30 to-black/60 text-white grid grid-cols-3">
          <div className="  h-full px-4 pt-[150px] pb-[100px] flex flex-col justify-between">
            <h4 className={`${aquire.className} text-7xl max-w-[500px]`}>
              {title}
            </h4>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={toggleYoutube}
                className=" bg-red-500 py-2 w-[140px] uppercase cursor-pointer border border-red-500 text-sm"
              >
                Watch Trailer
              </button>
              <button
                type="button"
                onClick={toggleYoutube}
                className=" flex items-center justify-center gap-2 py-2 w-[140px] uppercase cursor-pointer border border-neutral-400 text-sm"
              >
                <span>
                  <PlusIcon className="h-4 w-4" />
                </span>
                WatchList
              </button>
            </div>
          </div>
          <div className="h-full flex items-center justify-center">
            <Link
              href={{
                pathname: `/watch`,
                query: { name: title, media: media_type, id: film?.tmdbId },
              }}
              className="border-2 animate-pulse flex items-center justify-center border-red-500 rounded-full h-24 w-24"
            >
              <PlayIcon className="text-white-500 h-7 w-7" fill="white" />
            </Link>
          </div>
          <div className="flex flex-col justify-end pb-[100px] h-full">
            <div className="flex flex-col gap-2 pr-2">
              <div className="text-sm flex items-center gap-2">
                <p>{year}</p>
                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <div>
                  {runtime && (
                    <p className="flex items-center gap-2">
                      <span>{runtime}</span>
                    </p>
                  )}
                  {seasons && (
                    <p className=" flex items-center gap-2">
                      {seasons} {seasons > 1 ? "seasons" : "season"}
                    </p>
                  )}
                </div>

                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <p className="capitalize">{media_type}</p>

                <div className="h-[5px] w-[5px] bg-white rounded-full" />
                <div className="flex items-center gap-1">
                  {genres?.slice(0, 1).map((genre: string, idx: number) => (
                    <div className="flex items-center gap-1" key={idx}>
                      <p>{genre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[15px] max-w-[500px] leading-tight line-clamp-6">
                {overview}
              </p>
            </div>
          </div>
        </div>
      </div>
      {!kidsPage && (
        <TmdbContent
          media={media_type}
          tmdbId={singleFilm}
          trailerOpen={trailerOpen}
          toggleYoutube={toggleYoutube}
          title={title}
        />
      )}
    </div>
  );
};

export default Prewatch;
