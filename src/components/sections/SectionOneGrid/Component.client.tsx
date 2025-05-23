"use client";

import { useState, useRef, useEffect } from "react";

import {
  TrendingUp,
  Heart,
  Flame,
  AlignHorizontalJustifyStart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import dynamic from "next/dynamic";
import { type Film } from "@/drizzle/schema";
import FilmCard from "@/features/films/components/FilmCard";
import { User } from "@/types";
import { fetchUserData } from "@/features/films/server/db/films";

const AuthModal = dynamic(
  () => import("../../../features/auth/components/AuthModal"),
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

interface FilmType {
  posterImage?: string | null | undefined;
  title?: string | undefined;
  contentType?: "movie" | "tv" | undefined;
  tmdbId?: number | undefined;
  filmCategories?: Film["filmCategories"];
  filterCategory?: string;
}

const useFilter = (
  data: any,
  filter: string,
  favourites: any,
  watchList: any,
) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    //filter data by type

    switch (filter) {
      case "Trending":
        const trendingItems = data?.filter((film: any) => {
          const features = film?.filmCategories?.map(
            (t: { category: string }) => t.category,
          );

          const categories = Array.from(new Set(features?.flat()));

          return categories.includes("trending");
        });

        const trending = trendingItems;

        setFilteredData(trending);
        break;
      case "Popular":
        const popularItems = data?.filter((film: any) => {
          const features = film?.filmCategories?.map(
            (t: { category: string }) => t.category,
          );

          const categories = Array.from(new Set(features?.flat()));

          return categories.includes("popular");
        });
        const popular = popularItems;
        setFilteredData(popular);
        break;
      case "Favourites":
        setFilteredData(favourites);
        break;

      default:
        setFilteredData(watchList);
        break;
    }
  }, [data, filter, favourites, watchList]); //Update filtered data when the data or filter changes

  return filteredData;
};

const SectionOne = ({ featured, user }: { featured: Film[]; user: User }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [filter, setFilter] = useState<string>("Trending");
  const [data] = useState<Film[]>(featured);
  const [favourites, setFavourites] = useState<FilmType[]>([]);
  const [watchList, setWatchList] = useState<FilmType[]>([]);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const getUserWatchList = async (id?: number) => {
    return [
      {
        title: "Back in Action",
        tmdbId: 993710,
        posterImage: "/123455.jpg",
      },
    ];
  };

  const getUserFavouriteList = async (userId: number) => {
    const data = await fetchUserData(userId);
    const favorites = data?.favorites;
    const userFavouriteList = favorites;
    return userFavouriteList;
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
      const userFilms = await getUserFavouriteList(user?.id);
      if (userFilms && userFilms.length > 0) {
        favourited = userFilms.map((film) => {
          if (film !== null)
            return {
              title: film.title,
              tmdbId: film.tmdbId,
              contentType: film.mediaType,
              posterImage: film.posterImage,
            };
        });
      }
      const userFavouriteFilms = favourited ?? [];

      const userFavouriteList = userFavouriteFilms?.map((item) => ({
        ...item,
        filterCategory: "Favourites",
      }));

      setFavourites(userFavouriteList);
    } else {
      const value = "WatchList";
      setFilter(value);
      const userWatchList = await getUserWatchList(user?.id);

      const watchListWithCategory = userWatchList.map((item) => ({
        ...item,
        filterCategory: "WatchList",
      }));
      setWatchList(watchListWithCategory);
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

  const scrollContainer = (direction: number = 0) => {
    if (scrollContainerRef.current) {
      if (direction === 0) {
        // Reset scroll position to the start (when changing filter)
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Scroll left or right when clicking on arrows
        scrollContainerRef.current.scrollBy({
          left: direction * 300, // Adjust this value as needed for scrolling distance
          behavior: "smooth",
        });
      }
    }
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

      <div className="w-full hidden md:flex justify-end items-center pr-4 pt-3 md:pr-6">
        <div className="flex items-center gap-[1px]">
          <ChevronLeft
            onClick={() => scrollContainer(-1)}
            className="h-5 w-5 text-white/65 hover:text-white transition-colors duration-300 cursor-pointer"
          />
          <ChevronRight
            onClick={() => scrollContainer(1)}
            className="h-5 w-5 text-white/65 hover:text-white transition-colors duration-300 cursor-pointer"
          />
        </div>
      </div>
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
