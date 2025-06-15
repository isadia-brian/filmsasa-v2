"use server";

import { db } from "@/db";
import { filmCategories, films, InsertFilm, type Film } from "@/db/schema";
import { eq, and, lte, gte, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { convertMinutes } from "@/lib/formatters";
import { revalidatePath, revalidateTag } from "next/cache";
import { TMDBFilmData } from "@/types/films";
import { put } from "@vercel/blob";
import {
  fetchTmdbData,
  fetchTmdbImage,
} from "@/features/tmdb/server/actions/films";

// Generic function to fetch films by category
const fetchFilmsByCategory = cache(
  async (category: string): Promise<{ films: Film[] }> => {
    const categoryFilms = await db.query.films.findMany({
      where: (films, { exists }) =>
        exists(
          db
            .select()
            .from(filmCategories)
            .where(
              and(
                eq(filmCategories.filmTmdbId, films.tmdbId),
                eq(filmCategories.category, category),
              ),
            ),
        ),
      with: {
        filmCategories: {
          where: (filmCategories, { eq }) =>
            eq(filmCategories.category, category),
        },
      },
      orderBy: (films, { desc }) => [desc(films.created_at)],
    });

    const uniqueFilmsMap = new Map<number, Film>();
    categoryFilms.forEach((film) => {
      if (!uniqueFilmsMap.has(film.tmdbId)) {
        uniqueFilmsMap.set(film.tmdbId, film);
      }
    });
    const uniqueFilms = Array.from(uniqueFilmsMap.values());

    return {
      films: uniqueFilms,
    };
  },
);

// Cached functions using the generic function
export const fetchCarouselFilms = unstable_cache(
  async () => fetchFilmsByCategory("carousel"),
  ["carousel"],
  {
    tags: ["carousel"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

export const fetchTrending = unstable_cache(
  async () => fetchFilmsByCategory("trending"),
  ["trending"],
  {
    tags: ["trending"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

export const fetchPopular = unstable_cache(
  async () => fetchFilmsByCategory("popular"),
  ["popular"],
  {
    tags: ["popular"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

export const removeCategory = cache(
  async (
    filmTmdbId: number,
    category: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const deleted = await db.transaction(async (tx) => {
        // Delete specified category association
        const result = await tx
          .delete(filmCategories)
          .where(
            and(
              eq(filmCategories.filmTmdbId, filmTmdbId),
              eq(filmCategories.category, category),
            ),
          );
        if (!result) {
          return {
            success: false,
            message: "That film no longer exists in that category",
          };
        } else if (result && result.rowCount) {
          return result.rowCount > 0;
        } else {
          return;
        }
      });
      if (!deleted) {
        return {
          success: false,
          message: "Unable to remove category from the film",
        };
      } else {
        revalidateTag(category);
        revalidatePath("/");
        revalidatePath(`/admin/${category}`);

        return {
          success: true,
          message: "The category has been removed from the film",
        };
      }
    } catch (error) {
      console.log(`An error occurred on the server: ${error}`);
      return {
        success: false,
        message: "An error occurred on the server",
      };
    }
  },
);

// Fetch films by content type
export const fetchFilmsByContentType = cache(
  async (
    contentType: "movie" | "tv" | "kids",
    page: number = 1,
    pageSize: number = 24,
  ) => {
    const offset = (page - 1) * pageSize;

    const data = await db.query.films.findMany({
      where: and(
        eq(films.contentType, contentType),
        lte(films.year, 2025),
        and(gte(films.rating, 3), isNotNull(films.rating)),
      ),
      orderBy: (films, { desc }) => [desc(films.year)],
      offset,
      limit: pageSize,
    });

    // Fetch total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(films)
      .where(
        and(
          eq(films.contentType, contentType),
          lte(films.year, 2025),
          and(gte(films.rating, 3), isNotNull(films.rating)),
        ),
      );

    return {
      data,
      totalCount: Number(totalResult[0]?.count || 0),
    };
  },
);

export const fetchMovies = unstable_cache(
  async (page: number = 1, pageSize: number = 24) =>
    fetchFilmsByContentType("movie", page, pageSize),
  ["movies", "page"],
  {
    tags: ["movies"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

export const fetchSeries = unstable_cache(
  async (page: number = 1, pageSize: number = 24) =>
    fetchFilmsByContentType("tv", page, pageSize),
  ["series", "page"],
  {
    tags: ["series"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

export const fetchKids = unstable_cache(
  async (page: number = 1, pageSize: number = 24) =>
    fetchFilmsByContentType("kids", page, pageSize),
  ["kids", "page"],
  {
    tags: ["kids"],
    revalidate: 60 * 60 * 24 * 5, // 5 days
  },
);

// Fetch featured films
export const fetchFeatured = cache(async () => {
  // Fetch 10 trending films
  const trendingFilms = await db.query.films.findMany({
    where: (films, { exists, eq }) =>
      exists(
        db
          .select()
          .from(filmCategories)
          .where(
            and(
              eq(filmCategories.filmTmdbId, films.tmdbId),
              eq(filmCategories.category, "trending"),
            ),
          ),
      ),
    limit: 10,
    with: {
      filmCategories: true,
    },
    orderBy: (films, { desc }) => [desc(films.created_at)],
  });

  // Fetch 10 popular films
  const popularFilms = await db.query.films.findMany({
    where: (films, { exists, eq }) =>
      exists(
        db
          .select()
          .from(filmCategories)
          .where(
            and(
              eq(filmCategories.filmTmdbId, films.tmdbId),
              eq(filmCategories.category, "popular"),
            ),
          ),
      ),
    limit: 10,
    with: {
      filmCategories: true,
    },
  });

  // Combine results (trending first, then popular)
  return [...trendingFilms, ...popularFilms];
});

export async function insertFilmFromTmdb(
  tmdbFilm: TMDBFilmData,
  category: string,
  mediaType: "movie" | "tv",
) {
  try {
    return await db.transaction(async (tx) => {
      // Check for existing film
      const existingFilm = await tx.query.films.findFirst({
        where: eq(films.tmdbId, tmdbFilm.tmdbId),
      });

      // Handle existing film (no external calls)
      if (existingFilm) {
        const existingCategory = await tx.query.filmCategories.findFirst({
          where: and(
            eq(filmCategories.filmTmdbId, existingFilm.tmdbId),
            eq(filmCategories.category, category),
          ),
        });

        if (existingCategory) {
          return {
            message: `${tmdbFilm.title} already exists in category '${category}'`,
            action: "none",
          };
        }

        await tx.insert(filmCategories).values({
          filmTmdbId: existingFilm.tmdbId,
          category,
        });

        revalidateFilmData(category);
        return {
          message: `Added new category ${category} to ${tmdbFilm.title}`,
          action: "category_added",
        };
      }

      // Process new film (only when needed)

      // ... (prepareFilmData implementation from below) ...
      const filmData = await prepareFilmData(tmdbFilm, mediaType);

      const [newFilm] = await tx.insert(films).values(filmData).returning();
      await tx.insert(filmCategories).values({
        filmTmdbId: newFilm.tmdbId,
        category,
      });

      revalidateFilmData(category);
      return {
        message: `Created new film ${tmdbFilm.title} in ${category}`,
        action: "film_created",
      };
    });
  } catch (error) {
    console.error("Film insertion error:", error);
    return {
      message: "An error occurred while processing your request",
      action: "none",
    };
  }
}

// --- Helper Functions ---
async function prepareFilmData(
  tmdbFilm: TMDBFilmData,
  mediaType: "movie" | "tv",
): Promise<InsertFilm> {
  const [tmdbData, posterBlob, backdropBlob] = await Promise.all([
    fetchTmdbData(tmdbFilm.tmdbId, mediaType),
    fetchTmdbImage(tmdbFilm.poster_path, "w500"),
    fetchTmdbImage(tmdbFilm.backdrop_path, "w1280"),
  ]);

  const [vercelPosterImage, vercelBackdropImage] = await uploadFilmImages(
    tmdbFilm.title,
    posterBlob,
    backdropBlob,
  );

  return {
    tmdbId: tmdbFilm.tmdbId,
    title: tmdbFilm.title,
    overview: tmdbFilm.overview,
    contentType: mediaType,
    mediaType: mediaType,
    genres: tmdbFilm.genres,
    year: tmdbFilm.year,
    posterImage: vercelPosterImage,
    backdropImage: vercelBackdropImage,
    tmdbPosterUrl: tmdbFilm.poster_path,
    rating: Math.round(tmdbFilm.rating),
    seasons: mediaType === "tv" ? tmdbData.number_of_seasons : null,
    runtime: mediaType === "movie" ? convertMinutes(tmdbData.runtime) : null,
    quality: mediaType === "movie" ? "HD" : null,
  };
}

async function uploadFilmImages(
  title: string,
  posterBlob: Buffer,
  backdropBlob: Buffer,
): Promise<[string, string]> {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");

  const images = [
    { name: `films/${sanitize(title)}_Poster.jpg`, blob: posterBlob },
    { name: `films/${sanitize(title)}_Backdrop.jpg`, blob: backdropBlob },
  ];

  const uploaded = await Promise.all(
    images.map((img) =>
      put(img.name, img.blob, { access: "public", addRandomSuffix: true }),
    ),
  );

  return [uploaded[0].url, uploaded[1].url];
}

function revalidateFilmData(category: string) {
  revalidateTag(category);
  revalidatePath("/");
  revalidatePath(`/admin/${category}`);
}

export const getFilms = cache(
  unstable_cache(
    async () => {
      const result = await db.query.films.findMany();
      return result;
    },
    ["films"],
    {
      tags: ["films"],
      revalidate: 60 * 60 * 60 * 3,
    },
  ),
);
