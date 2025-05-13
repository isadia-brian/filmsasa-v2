"use client";

import { Button } from "@/components/ui/button";
import {
  addToCarousel,
  postToCarousel,
} from "@/features/films/server/db/films";
import {
  fetchPopular,
  fetchTrending,
} from "@/features/tmdb/server/actions/films";
import { posterURL } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { addFilmCategory } from "../../actions/tmdb";
import { useToast } from "@/hooks/use-toast";

type Film = {
  poster_path: string;
  id: number;
  title: string;
  name: string;
  vote_average: number;
};

const FeaturedFilms = ({
  title,
  category,
}: {
  title?: string;
  category: string;
}) => {
  const [films, setFilms] = useState<Film[]>([]);
  const [page, setPage] = useState<number>(1);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleClick = useCallback(
    async (content: "movie" | "tv", currentPage: number) => {
      try {
        setIsLoading(true);
        let data: any = [];
        if (category === "popular") {
          data = await fetchPopular(content, currentPage);
        } else {
          data = await fetchTrending(content, currentPage);
        }

        if (!data) {
          setFilms([]);
          return;
        }

        setMediaType(content);
        setPage(currentPage);
        setFilms(data);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, mediaType, films, page],
  );

  const PostToCategory = async (
    category: string,
    filmId: number,
    mediaType: "movie" | "tv",
  ) => {
    if (category === "carousel") {
      return await postToCarousel(filmId, mediaType);
    } else {
      const { success, message } = await addFilmCategory(
        filmId,
        mediaType,
        category,
      );

      console.log(success, message);

      if (success) {
        console.log("Yes success = true");
        toast({
          title: "Success",
          description: message,
        });
      } else {
        console.log("No success = false");
        toast({
          title: "Error",
          variant: "destructive",
          description: message,
        });
      }
    }
  };

  useEffect(() => {
    handleClick("movie", 1);
  }, []);

  return (
    <div>
      {title && (
        <div>
          <h3 className="font-bold uppercase">{title}</h3>
        </div>
      )}
      <div className="flex justify-between items-center my-3">
        <div className="flex items-center gap-2">
          <Button
            className="rounded-none w-[100px] cursor-pointer"
            onClick={() => handleClick("movie", 1)}
            disabled={isLoading}
          >
            Movies
          </Button>
          <Button
            className="rounded-none w-[100px] cursor-pointer"
            onClick={() => handleClick("tv", 1)}
            disabled={isLoading}
          >
            Tv
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2].map((num) => (
            <Button
              key={num}
              className="rounded-none cursor-pointer"
              onClick={() => handleClick(mediaType, num)}
              disabled={isLoading || page === num}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul className="grid md:grid-cols-6 gap-2 relative">
            {films.map((film) => (
              <li
                key={film.id}
                className="relative flex flex-col items-start gap-0.5"
              >
                <div className="h-[260px] w-full relative rounded">
                  <Image
                    src={posterURL(film.poster_path)}
                    fill
                    className="object-cover rounded"
                    alt={film?.title || film.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute right-1.5 top-1.5 px-2 py-2 w-10 bg-red-500 text-white rounded-md flex items-center justify-center">
                    <p>{Math.round(film.vote_average * 10) / 10}</p>
                  </div>
                </div>
                <Button
                  className="cursor-pointer"
                  disabled={isLoading}
                  onClick={() => PostToCategory(category, film.id, mediaType)}
                >
                  Add to {category}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeaturedFilms;
