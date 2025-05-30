import { fetchTrending, fetchPopular } from "@/features/films/server/db/films";
import SectionOne from "./Component.client";
import { User } from "@/types";

const SectionFilter = async ({ user }: { user: User | null }) => {
  const [{ films: trendingFilms }, { films: popularFilms }] = await Promise.all(
    [fetchTrending(), fetchPopular()],
  );

  const allFilms = [...trendingFilms, ...popularFilms];

  const featured = allFilms;

  return (
    <div>
      <SectionOne featured={featured} user={user} />
    </div>
  );
};

export default SectionFilter;
