import { useEffect, useState } from "react";

export const useFilter = (
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
