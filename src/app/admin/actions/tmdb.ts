/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

export async function getTmdbTrending() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
  );
  if (!res.ok) {
    console.log(`Something is not right`);
    return;
  }
  const { results } = await res.json();
  return results
    .slice(0, 20)
    .map(
      ({
        id,
        poster_path,
        title,
        name,
        vote_average,
        media_type,
      }: {
        id: string;
        poster_path: string;
        backdrop_path: string;
        title: string | undefined;
        name: string | undefined;
        vote_average: number;
        media_type: string;
      }) => ({
        id,
        poster_path,
        title,
        name,
        media_type,
        vote_average,
      }),
    )
    .filter(({ poster_path }: { poster_path: string }) => !!poster_path);
}
