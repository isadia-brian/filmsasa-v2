import { fetchSectionFilms } from "@/features/tmdb/server/actions/films";
import ContentSection from "./Component.client";
import { Suspense } from "react";

const CategoryGrid = async () => {
  const allFilms = await fetchSectionFilms();
  const films = allFilms;
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <ContentSection filmData={films} />
      </Suspense>
    </div>
  );
};

export default CategoryGrid;
