import { fetchSeries } from "@/features/films/server/db/films";
import Prewatch from "@/components/Prewatch";
import { db } from "@/drizzle";
import { films } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cache } from "react";

export const generateStaticParams = async () => {
  const { data: series } = await fetchSeries();
  return series.slice(0, 6).map((serie) => ({
    tmdbId: serie.tmdbId.toString(),
  }));
};

const page = async ({ params }: { params: Promise<{ tmdbId: string }> }) => {
  const { tmdbId } = await params;
  const tv = await queryFilmById({ tmdbId });

  if (!tv) return notFound();
  const {
    title,
    overview,
    year,
    seasons,
    rating,
    genres,
    posterImage,
    backdropImage,
    mediaType,
  } = tv;

  const film = {
    tmdbId,
    year,
    title,
    overview,
    rating,
    seasons,
    media_type: mediaType,
    posterImage,
    backdropImage,
    genres,
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
