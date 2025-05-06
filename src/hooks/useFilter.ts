import { useEffect, useState } from "react";
import { FilmCardProps } from "@/types/films";

export const useFilter = (data: FilmCardProps["film"][], filter: string) => {
  const [filteredData, setFilteredData] =
    useState<FilmCardProps["film"][]>(data);

  useEffect(() => {
    const filterMap: Record<string, string> = {
      Movies: "movie",
      Series: "tv",
      Kids: "kids",
    };

    const categoryTitle = filterMap[filter as keyof typeof filterMap];

    if (categoryTitle) {
      setFilteredData(
        data.filter(
          (item) =>
            item.contentType.toLowerCase() === categoryTitle.toLowerCase(),
        ),
      );
    } else {
      setFilteredData(data);
    }
  }, [data, filter]);

  return filteredData;
};
