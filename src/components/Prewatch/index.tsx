import { getUser } from "@/lib/dal";
import PrewatchClient from "./component.client";
import { fetchFilmDetails } from "@/features/tmdb/server/actions/films";

const Prewatch = async ({
  kidsPage,
  tmdbId,
  mediaType,
}: {
  mediaType: string;
  tmdbId: number;
  kidsPage?: boolean;
}) => {
  const film = await fetchFilmDetails({ mediaType, tmdbId });
  const user = await getUser();
  const userId = user?.id;
  return <PrewatchClient film={film} kidsPage={kidsPage} userId={userId} />;
};

export default Prewatch;
