import { fetchTrending, fetchPopular } from "@/features/films/server/db/films";
import { getUser } from "@/lib/dal";
import dynamic from "next/dynamic";

const SectionOne = dynamic(() => import("./Component.client"));

const SectionFilter = async () => {
  const [{ films: trendingFilms }, { films: popularFilms }, user] =
    await Promise.all([fetchTrending(), fetchPopular(), getUser()]);

  const allFilms = [...trendingFilms, ...popularFilms];

  const featured = allFilms;

  return (
    <div>
      <SectionOne featured={featured} user={user} />
    </div>
  );
};

export default SectionFilter;
