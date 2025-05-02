"use server";

import { db } from "@/drizzle";
import { films, type InsertFilm } from "@/drizzle/schema";
import { convertFilmMovies, convertSeries } from "./convertFilm";
import { convertMinutes } from "@/lib/formatters";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";

export const seedFilms = async (contentType: InsertFilm["contentType"]) => {
  let data = null;
  switch (contentType) {
    case "kids":
      data = await convertFilmMovies("kids");
      break;
    case "movie":
      data = await convertFilmMovies("movie");
      break;
    case "tv":
      data = await convertSeries();
      break;
    default:
      break;
  }

  if (!data) {
    return null;
  }
  const convertedData = data ?? [];

  try {
    const insertPromises = convertedData?.map(async (film) => {
      const singleFilm: InsertFilm = {
        title: film.title,
        tmdbId: film.tmdbId,
        overview: film.overview,
        contentType,
        mediaType: contentType == "tv" ? "tv" : "movie",
        posterImage: film.posterImage,
        backdropImage: film.backdropImage,
        quality: film.contentType == "tv" ? "" : "HD",
        genres: film.genres,
        year: film.year,
        rating: film.rating,
        runtime: film.runtime ? convertMinutes(film.runtime) : null,
        seasons: film.seasons ? film.seasons : null,
      };

      const result = await db.insert(films).values(singleFilm).returning();
      console.log(`Film "${film.title}" inserted with ID: ${result[0].id}`);
    });

    await Promise.all(insertPromises);
    console.log(`All ${tags[contentType]} inserted successfully`);
    revalidatePath(adminPaths[contentType]);
    revalidatePath(paths[contentType]);
    revalidateTag(tags[contentType]);

    return convertedData;
  } catch (error) {
    console.error("Error inserting films:", error);
    throw error;
  }
};

//lookup object for revalidation

const paths = {
  tv: "/series",
  movie: "/movies",
  kids: "/kids",
};

const adminPaths = {
  tv: "/admin/series",
  movie: "/admin/movies",
  kids: "/admin/kids",
};

const tags = {
  tv: "series",
  movie: "movies",
  kids: "kids",
};
