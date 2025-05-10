import Prewatch from "@/components/Prewatch";
import { searchFilm } from "@/features/tmdb/server/actions/films";

const page = async ({ params }: { params: Promise<{ tmdbId: string }> }) => {
  const { tmdbId } = await params;
  const filmId = parseInt(tmdbId);
  const media_type = "movie";
  const data = await searchFilm(media_type, filmId);
  const film = data;

  return (
    <div className="w-full text-slate-200 relative">
      <Prewatch film={film} />
    </div>
  );
};

export default page;
