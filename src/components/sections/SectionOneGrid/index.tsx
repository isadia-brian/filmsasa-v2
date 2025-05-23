import { fetchTrending, fetchPopular } from "@/features/films/server/db/films";
import { convertFilms } from "@/lib/utils";
import SectionOne from "./Component.client";
import { getUser } from "@/lib/dal";

const SectionFilter = async () => {
  const [{ films: trendingFilms }, { films: popularFilms }] = await Promise.all(
    [fetchTrending(), fetchPopular()],
  );

  const user = await getUser();
  const allFilms = [...trendingFilms, ...popularFilms];

  const featured = convertFilms(allFilms);

  return (
    <div>
      <SectionOne featured={featured} user={user} />
    </div>
  );
};

export default SectionFilter;
