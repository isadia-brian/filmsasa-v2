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
      className={`relative w-full ${
        trailerOpen ? "h-screen overflow-hidden " : "min-h-screen overflow-auto"
      }`}
    >
      <div
        className={`relative w-full flex flex-col justify-center ${kidsPage ? "h-[100vh]" : "h-[60vh] md:h-[80vh]"}`}
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
        <div className="absolute flex flex-col space-y-12 h-full w-full overflow-x-hidden left-0 bg-linear-to-tl from-black/60 via-black/30 to-black/60 text-white pt-[100px] md:pt-[150px] pb-4 px-4">
          <div className="w-full">
            <h4
              className={`${aquire.className} text-4xl md:text-7xl max-w-[250px] md:max-w-[500px]`}
            >
              {title}
            </h4>
          </div>

          <div className="flex items-center justify-center md:mt-[60px] md:w-fit md:mx-auto">
            <Link
              href={{
                pathname: `/watch`,
                query: { media: media_type, id: film?.tmdbId },
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
              <p className="max-w-[500px] leading-tight line-clamp-6">
                {overview}
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center md:items-end md:absolute md:bottom-0 md:pb-[90px]">
            <button
              type="button"
              onClick={toggleYoutube}
              className=" bg-red-500 py-1.5 md:py-2 w-[120px] md:w-[140px] uppercase cursor-pointer border border-red-500 text-sm"
            >
              Watch Trailer
            </button>
            <button
              type="button"
              onClick={toggleYoutube}
              className=" flex items-center justify-center gap-2 py-1.5 md:py-2 w-[120px] md:w-[140px] uppercase cursor-pointer border border-neutral-400 text-sm"
            >
              <span>
                <PlusIcon className="h-4 w-4" />
              </span>
              WatchList
            </button>
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
