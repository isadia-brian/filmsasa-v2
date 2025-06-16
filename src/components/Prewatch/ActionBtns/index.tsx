"use client";

import { addToUserList } from "@/features/users/server/db";
import { useToast } from "@/hooks/use-toast";
import { posterURL } from "@/lib/utils";
import { FilmData } from "@/types/films";
import { Heart, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface DataProps {
  userId: number | undefined;
  tmdbId: number;
  title: string;
  mediaType: "movie" | "tv";
  posterImage: string;
}

const handleClick = async (
  tmdbId: number,
  action: "favorites" | "watchlist",
  filmData: { title: string; mediaType: "movie" | "tv"; posterImage: string },
  userId: number | undefined,
  toast: ReturnType<typeof useToast>["toast"],
  router: ReturnType<typeof useRouter>,
) => {
  if (!userId) {
    toast({
      title: "Not Logged in",
      variant: "destructive",
      description: `Kindly sign in to add to your '${action}' `,
    });
    return;
  }

  try {
    const film: FilmData = {
      title: filmData.title,
      mediaType: filmData.mediaType,
      posterImage: posterURL(filmData.posterImage),
      tmdbPosterUrl: filmData.posterImage,
    };

    const response = await addToUserList(userId, tmdbId, action, film);
    const { success, message } = response;

    toast({
      title: success ? "Success" : "Error",
      variant: success ? "default" : "destructive",
      description: message,
    });

    if (success) router.refresh();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    toast({
      title: "Error",
      variant: "destructive",
      description: `An error occurred while adding to your '${action}': ${errorMessage}`,
    });
  }
};

export const WatchListBtn = (props: DataProps) => {
  const { tmdbId, userId, title, mediaType, posterImage } = props;
  const router = useRouter();
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        handleClick(
          tmdbId,
          "watchlist",
          { title, mediaType, posterImage },
          userId,
          toast,
          router,
        )
      }
      className="transition-colors flex items-center justify-center gap-2 py-1.5 md:py-2 w-[120px] md:w-[140px] uppercase cursor-pointer border border-white text-sm hover:bg-black hover:text-white hover:border-black"
    >
      <span>
        <PlusIcon className="h-4 w-4" />
      </span>
      WatchList
    </button>
  );
};

export const FavoriteBtn = (props: DataProps) => {
  const { tmdbId, userId, title, mediaType, posterImage } = props;
  const router = useRouter();
  const { toast } = useToast();

  return (
    <button
      className="mr-4 cursor-pointer"
      role="button"
      onClick={() =>
        handleClick(
          tmdbId,
          "favorites",
          { title, mediaType, posterImage },
          userId,
          toast,
          router,
        )
      }
    >
      <Heart className="h-8 w-8" />
    </button>
  );
};
