"use client";
import Link from "next/link";
import { ObservedTransition } from "./ObservedTransition";
import styles from "./HeroMovieCard.module.css";
import { Button } from "@/components/ui/button";
import { Heart, Play } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { AddToFavorites } from "@/features/users/server/actions/user";
import { useToast } from "@/hooks/use-toast";

type Proptype = {
  film: CarouselFilm;
  priorityLoad?: boolean;
};

export const HeroMovieCard = memo(function HeroMovieCard(props: Proptype) {
  const { film, priorityLoad = false } = props;
  const {
    title,
    backdropImage,
    genres,
    tmdbId,
    contentType,
    overview,
    seasons,
    runtime,
  } = film;

  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const { toast } = useToast();

  // Optimized with useCallback to prevent recreation on re-renders
  const handleClick = useCallback(
    async (tmdbId: number, userId: number) => {
      if (!userId || userId === 0) {
        return;
      } else if (loading) {
        return;
      } else {
        try {
          setLoading(true);
          const response = await AddToFavorites(userId, tmdbId, pathname);
          const { success, message } = response;

          toast({
            title: success ? "Success" : "Error",
            variant: success ? "default" : "destructive",
            description: message,
          });
        } catch (error) {
          console.log("Error posting");
          return;
        } finally {
          setLoading(false);
        }
      }
    },
    [loading, pathname, toast],
  );

  return (
    <div className={`relative overflow-hidden h-[60vh] md:h-[75vh] w-screen`}>
      <Image
        src={backdropImage || ""}
        alt={title}
        quality={priorityLoad ? 90 : 75}
        fill
        sizes="
          (max-width: 768px) 100vw,
          (max-width: 1280px) 1280px,
          1280px
        "
        className={`object-cover object-center md:object-top`}
        priority={priorityLoad}
        // Added loading strategy based on priority
        loading={priorityLoad ? "eager" : "lazy"}
        // Added fetchpriority attribute for better resource allocation
        fetchPriority={priorityLoad ? "high" : "auto"}
      />

      <section className={styles.heroCardInfo}>
        <ObservedTransition
          className={styles.fadeTransition}
          isVisibleClassName={styles.fadeIn}
        >
          <div className={`mt-3 md:mt-0`}>
            <div className="py-2 md:max-w-[600px] mb-3 md:mb-4">
              <ul className="flex items-center gap-1 mb-3 divide-x">
                {genres?.slice(0, 3).map(({ name }, index: number) => (
                  <li
                    key={index}
                    className="uppercase flex text-xs px-2 first:pl-0 leading-none text-stone-100 font-medium"
                  >
                    {name}
                  </li>
                ))}
              </ul>
              <h3 className="font-black text-white text-2xl md:text-5xl uppercase lg:text-6xl max-w-[300px] md:max-w-[600px] xl:max-w-full line-clamp-2 md:line-clamp-none mb-2 md:mb-4">
                {title || ""}
              </h3>
              <div className="flex items-center gap-2 text-stone-300 text-xs lg:text-sm mb-4 md:mb-4">
                <div className="font-bold text-orange-500 pr-3 leading-none border-r">
                  {contentType.toUpperCase()}
                </div>

                <div className="text-stone-200">
                  {runtime && (
                    <p className="font-bold flex items-center gap-2">
                      DURATION: <span>{runtime}</span>
                    </p>
                  )}
                  {seasons && (
                    <p className="font-bold flex items-center gap-2">
                      SEASON {seasons}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[13px] font-medium md:text-sm w-full md:w-[600px] 2xl:leading-[1.7] line-clamp-4 lg:leading-[1.5] text-stone-200 lg:text-[15px] text-balance">
                {overview}
              </p>
            </div>

            <div className="flex items-center gap-3 z-[200]">
              <RenderLink category={contentType} tmdbId={tmdbId} />
              <Button
                className={`flex items-center justify-center rounded pl-4 pr-6 h-10 backdrop-filter backdrop-blur-xs ${
                  loading
                    ? "disabled:bg-neutral-300 disabled:cursor-not-allowed"
                    : "bg-white/90 text-black cursor-pointer hover:bg-black hover:text-white"
                }`}
                onClick={() => handleClick(tmdbId, 0)}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center w-full md:w-[100px]">
                    <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Heart className="h-3 w-3" />
                    <span className="text-base">Favourite</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </ObservedTransition>
      </section>
      <div className="h-full w-full absolute top-0 left-0 bg-linear-to-t from-black/40 via-black/50 to-black/20 z-30" />
    </div>
  );
});

const RenderLink = ({
  category,
  tmdbId,
}: {
  category: string;
  tmdbId: number;
}) => {
  if (category) {
    let link: string = "";
    const categoryTitle = category;
    switch (categoryTitle) {
      case "tv":
        link = `/series/${tmdbId}`;
        break;

      case "movie":
        link = `/movies/${tmdbId}`;
        break;

      case "kids":
        link = `/kids/${tmdbId}`;
        break;

      default:
        break;
    }

    return (
      <Link
        prefetch={false}
        href={{
          pathname: link,
        }}
        className="flex items-center justify-center whitespace-nowrap pl-4 pr-6 h-10 rounded space-x-2  bg-linear-to-r from-orange-500 to-red-500 text-black cursor-pointer  transition-colors gradient element-to-rotate"
      >
        <Play className="h-3 w-3" fill="white" stroke="white" />
        <span className="text-base">Watch Now</span>
      </Link>
    );
  }
};
