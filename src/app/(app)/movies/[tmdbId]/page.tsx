import { fetchMovies } from "@/features/films/server/db/films";
import Prewatch from "@/components/Prewatch";
import { db } from "@/drizzle";
import { films } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";

export const generateStaticParams = async () => {
  const { data: movies } = await fetchMovies();
  return movies.slice(0, 6).map((movie) => ({
    tmdbId: movie.tmdbId.toString(),
  }));
};

const page = async ({ params }: { params: Promise<{ tmdbId: string }> }) => {
  const { tmdbId } = await params;
  const movie = await queryFilmById({ tmdbId });
  if (!movie) return notFound();
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
  } = movie;

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
      <Prewatch film={film} />
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
