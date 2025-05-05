import { fetchKids } from "@/features/films/server/db/films";
import Prewatch from "@/components/Prewatch";
import { db } from "@/drizzle";
import { films } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";

export const generateStaticParams = async () => {
  const { data: kids } = await fetchKids();
  return kids.slice(0, 6).map((film) => ({
    tmdbId: film.tmdbId.toString(),
  }));
};

const page = async ({ params }: { params: Promise<{ tmdbId: string }> }) => {
  const { tmdbId } = await params;
  const singleFilm = await queryFilmById({ tmdbId });
  if (!singleFilm) return notFound();

  const {
    title,
    overview,
    year,
    runtime,
    rating,
    genres,
    posterImage,
    backdropImage,
    mediaType,
  } = singleFilm;

  const film = {
    title,
    overview,
    year,
    runtime,
    rating,
    genres,
    tmdbId,
    posterImage,
    backdropImage,
    media: mediaType,
    media_type: mediaType,
  };

  return (
    <div className="w-full text-slate-200 relative">
      <Prewatch film={film} kidsPage={true} />
    </div>
  );
};

export default page;

const queryFilmById = cache(async ({ tmdbId }: { tmdbId: string }) => {
  const filmId = parseInt(tmdbId);
  const result = await db.query.films.findFirst({
    where: eq(films.tmdbId, filmId),
  });
  return result || null;
});
