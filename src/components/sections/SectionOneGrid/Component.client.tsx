"use client";

import { useState, useRef } from "react";

import { useFilter } from "@/hooks/useFilterSection";

import {
  TrendingUp,
  Heart,
  Flame,
  AlignHorizontalJustifyStart,
} from "lucide-react";

import dynamic from "next/dynamic";
import { type Film } from "@/db/schema";
import FilmCard from "@/features/films/components/FilmCard";
import { User } from "@/types";
import { fetchUserData } from "@/features/users/server/db";
import { FilmType } from "@/types/films";
import { scrollContainer } from "@/lib/utils";
import { ScrollButtons } from "@/components/ScrollButtons";

const AuthModal = dynamic(
  () => import("../../../features/auth/components/AuthModal"),
  { ssr: false },
);

const headerButtons = [
  {
    title: "Trending",
    icon: <TrendingUp className="icon" />,
  },
  {
    title: "Watching",
    icon: <AlignHorizontalJustifyStart className="icon" />,
  },
  {
    title: "Popular",
    icon: <Flame className="icon" />,
  },
  {
    title: "Favourites",
    icon: <Heart className="icon" />,
  },
];

const SectionOne = ({
  featured,
  user,
}: {
  featured: Film[];
  user: User | null;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [filter, setFilter] = useState<string>("Trending");
  const [data] = useState<Film[]>(featured);
  const [favourites, setFavourites] = useState<FilmType[]>([]);
  const [watchList, setWatchList] = useState<FilmType[]>([]);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const getUserData = async (userId: number) => {
    const data = await fetchUserData(userId);
    const favorites = data?.favorites;
    const watchList = data?.watchlist;

    return {
      favorites,
      watchList,
    };
  };

  // The filtered data that is returned by the custom hook
  const filteredData = useFilter(data, filter, favourites, watchList);

  const watchingFilterClicked = async (filter: string) => {
    if (!user) {
      setShowAuth(true);
      setActiveButtonIndex(0);
      return;
    } else if (filter === "Favourites") {
      const value = filter;
      setFilter(value);
      let favourited = null;
      const { favorites } = await getUserData(user?.id);
      if (favorites && favorites.length > 0) {
        favourited = favorites.map((film) => {
          if (film !== null)
            return {
              title: film.title,
              tmdbId: film.tmdbId,
              contentType: film.mediaType,
              posterImage: film.posterImage,
            };
        });
      }
      const userFavourites = favourited ?? [];

      const userFavouriteList = userFavourites?.map((item) => ({
        ...item,
        filterCategory: "Favourites",
      }));

      setFavourites(userFavouriteList);
    } else {
      const value = "WatchList";
      setFilter(value);
      let userWatchList = null;
      const { watchList } = await getUserData(user?.id);
      if (watchList && watchList.length > 0) {
        userWatchList = watchList.map((film) => {
          return {
            title: film.title,
            tmdbId: film.tmdbId,
            contentType: film.mediaType,
            posterImage: film.posterImage,
          };
        });
      }

      const userWatchListFilms = userWatchList ?? [];

      const userWatchLists = userWatchListFilms?.map((item) => ({
        ...item,
        filterCategory: "WatchList",
      }));
      setWatchList(userWatchLists);
    }
  };

  const handleFilter = async (index: number) => {
    setActiveButtonIndex(index);

    if (index === 0) {
      setFilter("Trending");
    } else if (index === 1) {
      watchingFilterClicked("Watching");
    } else if (index === 2) {
      setFilter("Popular");
    } else {
      watchingFilterClicked("Favourites");
    }

    // Reset the scroll position to 0 when a new filter is selected
    scrollContainer(0);
  };

  return (
    <div className=" text-white mb-5 relative w-full">
      {showAuth && (
        <div>
          <AuthModal toggleAuth={() => setShowAuth(false)} />
        </div>
      )}

      <div className="relative border-b-[0.5px] border-white/20">
        <div className="flex gap-5 md:gap-0 justify-between px-4 md:px-6 h-[80px] md:py-4 md:h-[50px]">
          {headerButtons.map(({ title, icon }, index) => (
            <div
              className="flex gap-2 items-center cursor-pointer md:w-max"
              onClick={() => handleFilter(index)}
              key={index}
            >
              <p
                className={`hidden md:inline-block ${
                  index === activeButtonIndex ? "text-orange-500" : ""
                }`}
              >
                {icon}
              </p>
              <p
                className={` transition-all duration-200 ${
                  index === activeButtonIndex
                    ? "md:text-[20px] font-bold text-orange-500"
                    : "text-gray-300/50 text-[13px]"
                }`}
              >
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ScrollButtons scrollContainerRef={scrollContainerRef} />
      <div
        ref={scrollContainerRef}
        className="relative lg:min-h-[360px] flex gap-[10px] px-4 pt-5 w-full  overflow-x-scroll no-scrollbar"
      >
        {filteredData?.length >= 1 ? (
          filteredData.map((film: any, index: number) => {
            return <FilmCard film={film} key={index} section={true} />;
          })
        ) : (
          <div className="w-full flex min-h-52 md:pt-12 items-center justify-center">
            <p className="text-white text-2xl font-black text-center">
              You have not added any films to this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionOne;
