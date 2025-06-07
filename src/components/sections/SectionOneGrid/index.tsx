import { fetchTrending, fetchPopular } from "@/features/films/server/db/films";
import SectionOne from "./Component.client";
import { getUser } from "@/lib/dal";

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
