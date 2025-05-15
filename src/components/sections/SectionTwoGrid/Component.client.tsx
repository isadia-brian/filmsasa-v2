"use client";

import { useState } from "react";
import { useWindowSize, useFilter } from "@/hooks";
import { Clapperboard, Film as Series, Video } from "lucide-react";
import Link from "next/link";
import FilmCard from "@/features/films/components/FilmCard";
import { FilmCardProps } from "@/types/films";

const headerButtons = [
  {
    title: "Movies",
    link: "/movies",
    icon: <Clapperboard className="h-4 w-4" />,
  },
  {
    title: "Series",
    link: "/series",
    icon: <Series className="h-4 w-4" />,
  },
  {
    title: "Kids",
    link: "/kids",
    icon: <Video className="h-4 w-4" />,
  },
];

type PropType = {
  filmData: FilmCardProps["film"][];
};

const ContentSection: React.FC<PropType> = (props) => {
  const { filmData } = props;
  const [activeButtonIndex, setActiveButtonIndex] = useState<number>(0);
  const [navLink, setNavLink] = useState<string>("/movies");
  const [data] = useState<FilmCardProps["film"][]>(filmData);

  const { width } = useWindowSize();
  const filmsToShow = width < 768 ? 3 : width < 1024 ? 4 : 6;

  // The filter value controlled by the buttons
  const [filter, setFilter] = useState<string>("Movies");

  // The filtered data that is returned by the custom hook
  const filteredData = useFilter(data, filter);

  const handleFilter = (index: number) => {
    setActiveButtonIndex(index);

    if (index === 0) {
      setFilter("Movies");
      setNavLink("/movies");
    } else if (index === 1) {
      setFilter("Series");
      setNavLink("/series");
    } else {
      setFilter("Kids");
      setNavLink("/kids");
    }
  };

  return (
    <div className="relative w-full text-white mb-5 md:mb-8">
      <div className="flex w-full border-b-[0.5px] border-white/20">
        <div className="flex items-center w-full justify-between md:mb-0 px-4 h-[80px] md:h-[50px]">
          {headerButtons.map(({ title, icon }, index) => (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleFilter(index)}
              key={index}
            >
              <p
                className={`hidden md:inline-block ${index === activeButtonIndex ? "text-orange-500" : ""}`}
              >
                {icon}
              </p>
              <h1
                className={`transition-all duration-200 ${
                  index === activeButtonIndex
                    ? "md:text-[20px] font-bold text-orange-500"
                    : "text-gray-300/50 text-[13px]"
                }`}
              >
                {title}
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-3 pr-4">
        <Link
          prefetch={false}
          href={navLink}
          className="text-xs underline underline-offset-2"
        >
          See all
        </Link>
      </div>

      <div className="gap-2 w-full grid grid-cols-3 px-4 h-full pt-4 pb-10 md:pt-6 overflow-x-scroll no-scrollbar md:gap-x-[12px] gap-y-10 lg:grid-cols-6">
        {filteredData
          ?.slice(0, filmsToShow)
          .map((film, index) => <FilmCard film={film} key={index} />)}
      </div>
    </div>
  );
};

export default ContentSection;
