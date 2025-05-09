"use server";

import { db } from "@/drizzle";
import { eq } from "drizzle-orm";
import { films, type Film } from "@/drizzle/schema";

export const findFilm = async (
  tmdbId: Film["tmdbId"],
): Promise<Film | null> => {
  try {
    const result = await db.query.films.findFirst({
      where: eq(films.tmdbId, tmdbId),
      with: {
        filmCategories: true,
      },
    });
    return result || null; // Return null if no film is found
  } catch (error) {
    console.error("Error finding film:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
