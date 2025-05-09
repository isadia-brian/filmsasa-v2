"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { SearchIcon, X } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { smallPosterURL } from "@/lib/utils";
import { searchContent } from "@/features/tmdb/server/actions/films";

const FilmsSearch = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [tv, setTv] = useState([]);
  const [people, setPeople] = useState([]);

  const handleSearch = useCallback(async () => {
    const searchTerm = searchValue.trim();
    if (!searchTerm) {
      setMovies([]);
      setTv([]);
      setPeople([]);
      return;
    }

    try {
      const data = await searchContent(searchTerm);
      if (!data) return;

      // Categorize results by media_type
      const moviesData = data?.filter(
        (item: { media_type: string }) => item.media_type === "movie",
      );
      const tvData = data?.filter(
        (item: { media_type: string }) => item.media_type === "tv",
      );
      const peopleData = data?.filter(
        (item: { media_type: string }) => item.media_type === "person",
      );

      setMovies(moviesData);
      setTv(tvData);
      setPeople(peopleData);
    } catch (error) {
      console.error("Search error:", error);
      setMovies([]);
      setTv([]);
      setPeople([]);
    }
  }, [searchValue]);

  // Add search debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isOpen) handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue, handleSearch, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-full cursor-pointer h-[32px] w-[32px] bg-slate-200 hover:bg-slate-50 hover:text-black flex items-center px-0 py-0 justify-center"
      >
        <SearchIcon className="text-black" />
      </Button>
      {isOpen && (
        <div className="fixed inset-0 pt-28 z-2000 bg-black/90 backdrop-blur-md no-scrollbar w-full overflow-y-auto">
          <div
            className="absolute top-4 right-4 flex items-center justify-center bg-red-600 rounded-full h-10 w-10"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </div>

          <div className=" mx-20 flex flex-col gap-10 ">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-white text-6xl w-full px-4 outline-none font-black"
              placeholder="Search Film ..."
            />
            <div className="text-white h-[650px] grid grid-cols-3 gap-3 px-4 py-2">
              <div className="h-full flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <p>Movies</p>
                  {movies.length > 0 && (
                    <p className="text-xs text-neutral-400">
                      {movies.length} results
                    </p>
                  )}
                </div>
                <div
                  className="overflow-y-scroll max-h-[550px] [&::-webkit-scrollbar]:w-[4px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-red-500
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >
                  <ul className="flex flex-col gap-2">
                    {movies.map(
                      (
                        item: { poster_path?: string; title: string },
                        i: number,
                      ) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-[100px] w-[100px] relative bg-white">
                            <ImageWithSkeleton
                              src={
                                typeof item.poster_path === "string"
                                  ? smallPosterURL(item.poster_path)
                                  : "/placeholder.webp"
                              }
                              fill
                              alt={item.title}
                              className="object-cover"
                            />
                          </div>
                          <p className="font-semibold max-w-[200px]">
                            {item.title}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
              <div className="h-full flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <p>TV</p>
                  {tv.length > 0 && (
                    <p className="text-xs text-neutral-400">
                      {tv.length} results
                    </p>
                  )}
                </div>

                <div
                  className="overflow-y-scroll max-h-[550px] [&::-webkit-scrollbar]:w-[4px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-red-500
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >
                  <ul className="flex flex-col gap-2">
                    {tv.map(
                      (
                        item: { poster_path?: string; name: string },
                        i: number,
                      ) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-[100px] w-[100px] relative bg-white">
                            <ImageWithSkeleton
                              src={
                                typeof item.poster_path === "string"
                                  ? smallPosterURL(item.poster_path)
                                  : "/placeholder.webp"
                              }
                              fill
                              alt={item.name}
                              className="object-cover"
                            />
                          </div>
                          <p className="font-semibold max-w-[200px]">
                            {item.name}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
              <div className="h-full flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <p>People</p>
                  {people.length > 0 && (
                    <p className="text-xs text-neutral-400">
                      {people.length} results
                    </p>
                  )}
                </div>
                <div
                  className="overflow-y-scroll max-h-[550px] [&::-webkit-scrollbar]:w-[4px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-red-500
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                >
                  <ul className="flex flex-col gap-2">
                    {people.map(
                      (
                        item: { profile_path?: string; name: string },
                        i: number,
                      ) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-[100px] w-[100px] relative bg-white">
                            <ImageWithSkeleton
                              src={
                                typeof item.profile_path === "string"
                                  ? smallPosterURL(item.profile_path)
                                  : "/placeholder.webp"
                              }
                              fill
                              alt={item.name}
                              className="object-cover"
                            />
                          </div>
                          <p className="font-semibold max-w-[200px]">
                            {item.name}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmsSearch;
