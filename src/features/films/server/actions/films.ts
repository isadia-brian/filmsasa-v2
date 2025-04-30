"use server";

import { db } from "@/drizzle";
import { filmCategories, films } from "@/drizzle/schema";
import { eq, and, lte, gte, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

// Generic function to fetch films by category
const fetchFilmsByCategory = cache(async (category: string) => {
  const result = db.query.films.findMany({
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
  return result;
});

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

// Fetch section films in a single query
export const fetchSectionFilms = cache(async () => {
  const [movies, series, kids] = await Promise.all([
    fetchMovies(),
    fetchSeries(),
    fetchKids(),
  ]);

  const slicedMovies = movies?.data?.slice(0, 7);
  const slicedSeries = series?.data?.slice(0, 7);
  const slicedKids = kids?.data?.slice(0, 7);

  const allFilms = [...slicedMovies, ...slicedSeries, ...slicedKids];
  return allFilms;
});

export const fetchFilmGenres = cache(async () => {
  const films = await db.query.films.findMany({});

  // Handle possible undefined genres
  const allGenres = films.flatMap((film) => film.genres ?? []);

  // Handle possible undefined years (filter them out)
  const allYears = films.flatMap((film) => (film.year ? [film.year] : []));

  const uniqueGenres = [...new Set(allGenres)];
  const uniqueYears = [...new Set(allYears)];

  const sortedGenres = uniqueGenres.sort();
  const sortedYears = uniqueYears
    .filter((year) => year <= 2025)
    .sort((a, b) => b - a);

  return {
    genres: sortedGenres,
    years: sortedYears,
  };
});
