import { fetchSectionFilms } from "@/features/films/server/db/films";
import ContentSection from "./Component.client";
import { Suspense } from "react";

const CategoryGrid = async () => {
  const allFilms = await fetchSectionFilms();
  const films = allFilms.flatMap(
    ({ tmdbId, title, contentType, posterImage }) => {
      return { tmdbId, title, contentType, posterImage };
    },
  );
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <ContentSection filmData={films} />
      </Suspense>
    </div>
  );
};

export default CategoryGrid;
