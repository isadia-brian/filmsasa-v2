/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import {
  type Film,
  filmCategories,
  films,
  type InsertFilm,
} from "@/drizzle/schema";
import { convertMinutes } from "@/lib/formatters";
import { db } from "@/drizzle";
import { revalidateTag, revalidatePath } from "next/cache";
import { findFilm } from "./findFilm";
import { eq, and } from "drizzle-orm";

export async function getKidsContent() {
  const allData: Film[] = [];

  const baseUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${process.env.TMDB_API_KEY}&page=`;

  const urls = Array.from({ length: 20 }, (_, i) => `${baseUrl}${i + 1}`);

  try {
    await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
      .then((responses) => {
        responses.map((res) => {
          const { results } = res;
          const film = results.map(
            ({
              id,
              poster_path,
              backdrop_path,
              overview,
              title,
              vote_average,
              release_date,
            }: {
              id: number;
              poster_path: string;
              backdrop_path: string;
              title: string;
              vote_average: number;
              overview: string;
              release_date: string;
            }) => {
              return {
                id,
                title,
                overview,
                poster_path,
                backdrop_path,
                vote_average,
                release_date,
              };
            },
          );
          return allData.push(...film);
        });
      })
      .catch((err) => console.error(err));
    return allData;
  } catch (error) {
    console.warn(error);
  }
}

export const seedKids = async () => {
  const data = await getKidsContent();
  const dbFilms = await db.select().from(films);
  const kidsContent = data?.filter(
    (film) => !dbFilms.some((dbFilm) => dbFilm.tmdbId === film.id),
  );
  return kidsContent as Film[];
};

export async function searchFilms(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1&api_key=${process.env.TMDB_API_KEY}`,
  );
  const { results } = await res.json();
  return results
    .map(
      ({
        id,
        poster_path,
        title,
        name,
        media_type,
      }: {
        id: string;
        poster_path: string;
        backdrop_path: string;
        title: string | undefined;
        name: string | undefined;
        media_type: string;
      }) => ({
        id,
        poster_path,
        title,
        name,
        media_type,
      }),
    )
    .filter(({ poster_path }: { poster_path: string }) => !!poster_path);
}

export async function addFilmCategory(
  filmId: number,
  media_type: string,
  category: string, // Changed to required parameter
): Promise<{ success: boolean; message: string }> {
  try {
    // Find existing film using tmdbId
    let existingFilm = await findFilm(filmId);

    // Create film if it doesn't exist
    if (!existingFilm) {
      const res = await fetch(
        `https://api.themoviedb.org/3/${media_type}/${filmId}?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
      );

      if (!res.ok) {
        return {
          success: false,
          message: "Failed to fetch data",
        };
      }

      const data = await res.json();
      const {
        title,
        name,
        overview,
        poster_path,
        backdrop_path,
        genres: genreObjects,
        vote_average,
        release_date,
        first_air_date,
        number_of_seasons,
        runtime,
      } = data;

      // Process genres
      const genres =
        genreObjects?.map(({ name }: { name: string }) => name) || [];

      // Calculate year
      const year =
        release_date?.split("-")[0] || first_air_date?.split("-")[0] || null;

      // Process runtime
      let filmRuntime: string | null = null;
      if (media_type === "movie" && runtime) {
        filmRuntime = convertMinutes(runtime);
      }

      // Create film object
      const film: InsertFilm = {
        title: title || name,
        tmdbId: filmId,
        overview: overview || "",
        posterImage: poster_path || "",
        contentType: media_type === "movie" ? "movie" : "tv",
        mediaType: media_type === "movie" ? "movie" : "tv",
        backdropImage: backdrop_path || "",
        rating: Math.round(vote_average) || null,
        genres,
        year: year ? parseInt(year) : null,
        seasons: number_of_seasons || null,
        runtime: filmRuntime,
      };

      // Insert new film and get created record
      const [newFilm] = await db.insert(films).values(film).returning();
      existingFilm = newFilm;
    }

    const existingCategory = await db.query.filmCategories.findFirst({
      where: and(
        eq(filmCategories.filmTmdbId, existingFilm.tmdbId),
        eq(filmCategories.category, category),
      ),
    });
    // // If the category already exists, return a message
    if (existingCategory) {
      return {
        success: false,
        message: `The film already has the category "${category}".`,
      };
    }
    // Create new category association if it doesn't exist
    if (!existingCategory) {
      await db.insert(filmCategories).values({
        filmTmdbId: existingFilm.tmdbId,
        category: category,
      });

      // Revalidate relevant paths
      revalidatePath("/");
      revalidatePath(`/admin/${category}`);
      revalidateTag(category); // Revalidate based on the category
    }

    return {
      success: true,
      message: `Film with ID: ${filmId} to category ${category} processed successfully`,
    };
  } catch (error) {
    console.error("Error in addFilmCategory:", error);
    return {
      success: false,
      message: "An error occurred while adding the category.",
    };
  }
}

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

export async function getTmdbPopular() {
  try {
    const data = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/popular?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
      ),
    ]);

    const allData = await Promise.all(data.map((res) => res.json()));

    const combinedResults = allData
      .map((d, index) =>
        d.results
          .slice(0, 20)
          .map(
            ({
              id,
              name,
              title,
              poster_path,
              vote_average,
            }: {
              id: number;
              name: string;
              title: string;
              poster_path: string;
              vote_average: string;
            }) => ({
              id,
              name,
              title,
              vote_average,
              poster_path,
              media_type: index === 0 ? "movie" : "tv",
            }),
          ),
      )
      .flat();

    return combinedResults;
  } catch (error) {
    console.warn(error);
  }
}

export async function removeFilmCategory(
  filmId: number,
  category: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Find existing film using tmdbId
    const existingFilm = await findFilm(filmId);
    if (!existingFilm) {
      return { success: false, message: "Film not found" };
    }

    // Delete the category association
    await db
      .delete(filmCategories)
      .where(
        and(
          eq(filmCategories.filmTmdbId, existingFilm.tmdbId),
          eq(filmCategories.category, category),
        ),
      );

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath(`/admin/${category}`);
    revalidateTag(category);

    return {
      success: true,
      message: `Removed from ${category} successfully`,
    };
  } catch (error) {
    console.error("Error in removeFilmCategory:", error);
    return {
      success: false,
      message: "An error occurred while removing the category.",
    };
  }
}
