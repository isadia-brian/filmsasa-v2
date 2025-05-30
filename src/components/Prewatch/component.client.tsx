"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Heart, PlayIcon, PlusIcon, Youtube as Tube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aquire } from "@/app/fonts";
import { addToUserList } from "@/features/users/server/db";
import { FilmData } from "@/types/films";
import { useRouter } from "next/navigation";
import { posterURL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TmdbContent = dynamic(
  () => import("../../features/films/components/TmdbContent"),
);
const PrewatchClient = (props: {
  film: any;
  kidsPage?: boolean;
  userId?: number;
}) => {
  const { film, kidsPage, userId } = props;

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    title,
    tmdbId,
    year,
    overview,
    backdropImage,
    posterImage,
    genres,
    media_type,
    seasons,
    runtime,
  } = film;

  const singleFilm: number = parseInt(tmdbId);

  const handleClick = useCallback(
    async (tmdbId: number, action: "favorites" | "watchlist") => {
      if (!userId) {
        toast({
          title: "Not Logged in",
          variant: "destructive",
          description: `Kindly sign in to add to your '${action}' `,
        });
        return;
      } else if (loading) {
        return;
      } else {
        try {
          setLoading(true);
          const film: FilmData = {
            title,
            mediaType: media_type,
            posterImage: posterURL(posterImage),
          };
          const response = await addToUserList(userId, tmdbId, action, film);
          const { success, message } = response;

          toast({
            title: success ? "Success" : "Error",
            variant: success ? "default" : "destructive",
            description: message,
          });

          if (success) router.refresh();
        } catch (error) {
          toast({
            title: "Error",
            variant: "destructive",
            description: `An error occurred while adding to your '${action}'`,
          });
          return;
        } finally {
          setLoading(false);
        }
      }
    },
    [loading, toast],
  );

  const toggleYoutube = () => {
    setTrailerOpen(!trailerOpen);
  };

  let duration: string = "";

  if (runtime) {
    duration = runtime;
  } else {
    duration = seasons === 1 ? "1 season" : `${seasons} seasons`;
  }

  const firstThreeGenres = genres.slice(0, 3);

  const genresText =
    firstThreeGenres.length > 1
      ? firstThreeGenres.join(" - ")
      : firstThreeGenres[0] || "";

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
            quality={80}
            className="object-cover"
            priority={true}
            loading="eager"
            sizes="
          (max-width: 768px) 100vw,1280px
        "
          />
        </div>
        <div className="absolute flex flex-col space-y-12 h-full w-full overflow-x-hidden left-0 bg-linear-to-tl from-black/60 via-black/30 to-black/60 text-white pt-[100px] md:pt-[150px] pb-4 px-4">
          <div className="w-full flex justify-between items-center z-[1000]">
            <h4
              className={`${aquire.className} text-4xl md:text-7xl max-w-[250px] md:max-w-[500px]`}
            >
              {title}
            </h4>
            <div
              className="mr-4 cursor-pointer"
              role="button"
              onClick={() => handleClick(tmdbId, "favorites")}
            >
              <Heart className="h-8 w-8" />
            </div>
          </div>

          <div className="md:absolute md:z-[1500]  md:h-full md:top-0  flex items-center justify-center md:left-[50%] md:-translate-x-1/2 md:w-fit">
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
                <Tube className="h-4 w-4" />
              </span>
              Watch Trailer
            </button>
            <button
              type="button"
              onClick={() => handleClick(tmdbId, "watchlist")}
              className="transition-colors flex items-center justify-center gap-2 py-1.5 md:py-2 w-[120px] md:w-[140px] uppercase cursor-pointer border border-white text-sm hover:bg-black hover:text-white hover:border-black"
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

export default PrewatchClient;
