"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SearchIcon, X } from "lucide-react";
import { searchContent } from "@/features/tmdb/server/actions/films";
import FilmsGrid from "./FilmsGrid";

const FilmsSearchModal = () => {
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
        <div className="fixed inset-0 pt-20 md:pt-28 z-2000 bg-black/90 backdrop-blur-md no-scrollbar w-full overflow-y-auto">
          <div
            className="absolute top-4 right-4 flex items-center justify-center bg-red-600 rounded-full h-6 w-6 md:h-10 md:w-10"
            onClick={() => setIsOpen(false)}
          >
            <X />
          </div>

          <div className=" mx-4 md:mx-20 flex flex-col-reverse md:flex-col gap-10 h-full pb-8 ">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-white text-2xl md:text-6xl w-full md:px-4 outline-none font-black"
              placeholder="Search Film ..."
            />
            <div className="text-white md:h-[650px] grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 md:px-4 py-2 justify-between h-full">
              <FilmsGrid
                contentType="movies"
                setIsOpen={setIsOpen}
                data={movies}
              />
              <FilmsGrid contentType="series" setIsOpen={setIsOpen} data={tv} />
              <FilmsGrid setIsOpen={setIsOpen} data={people} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmsSearchModal;
