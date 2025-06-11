import { fetchSectionFilms } from "@/features/tmdb/server/actions/films";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const ContentSection = dynamic(() => import("./Component.client"));

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
