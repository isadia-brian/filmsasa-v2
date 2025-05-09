"use server";

import { db } from "@/drizzle";
import { filmCategories, films } from "@/drizzle/schema";
import { eq, and, lte, gte, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import fs from "fs";
import path from "path";
import { backdropURL } from "@/lib/utils";
import { convertMinutes } from "@/lib/formatters";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

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
  const films = await getFilms();

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

export const addToCarousel = async (
  filmId: number,
  mediaType: "movie" | "tv",
) => {
  try {
    const movieDataReq = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${filmId}?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
    );
    const {
      title: movieTitle,
      name: tvTitle,
      overview,
      backdrop_path,
      runtime: movieRuntime,
      number_of_seasons: seasons,
      genres: genreObjects,
    } = await movieDataReq.json();

    const title = movieTitle || tvTitle;
    let runtime: string | null = null;
    if (!movieRuntime) {
      runtime = null;
    } else {
      runtime = convertMinutes(movieRuntime);
    }
    const genres = genreObjects.map(({ name }: { name: string }) => ({ name }));

    // Helper function to sanitize titles for filenames
    const sanitizeFileName = (title: string) =>
      title
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w-]/g, ""); // Remove non-alphanumeric characters

    const response = await fetch(backdropURL(backdrop_path));
    const arrayBuffer = await response.arrayBuffer();
    const posterBuffer = Buffer.from(arrayBuffer);

    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public", "carousel");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save image to filesystem
    const fileName = `${sanitizeFileName(title)}.jpg`;
    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, posterBuffer);

    // Create film object with image path
    const film = {
      tmdbId: filmId,
      title,
      contentType: mediaType,
      runtime,
      seasons,
      overview,
      backdropImage: `/carousel/${fileName}`,
      genres,
    };

    // Add to carousel data
    const dataPath = path.join(process.cwd(), "src", "data");
    if (!fs.existsSync(dataPath)) {
      console.log(`Creating directory ${dataPath}`);
      fs.mkdirSync(dataPath, { recursive: true });

      console.log(`Created directory ${dataPath} successfully`);
    }
    const carouselFile = "carousel.ts";
    const fullDataPath = path.join(dataPath, carouselFile);

    const carouselData = fs.existsSync(fullDataPath)
      ? require("../../../../../src/data/carousel.ts").carouselFilms
      : [];

    // Avoid duplicates
    if (!carouselData.some((f: any) => f.tmdbId === film.tmdbId)) {
      const updatedFilms = [...carouselData, film];

      // Create data directory if it doesn't exist
      const dataDir = path.dirname(fullDataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write formatted TypeScript file
      const fileContent = `// Auto-generated carousel data
export const carouselFilms = ${JSON.stringify(updatedFilms, null, 2)};`;

      fs.writeFileSync(fullDataPath, fileContent);
      console.log("Successfully updated carousel data");
    }

    revalidateTag("carousel");
    revalidatePath("/admin/carousel");
    revalidatePath("/");

    return film;
  } catch (error) {
    console.error("Error processing movie:", error);
    throw error;
  }
};

export const deleteFromCarousel = cache(async (filmId: number) => {
  try {
    const dataPath = path.join(process.cwd(), "src", "data", "carousel.ts");

    // Read current carousel data
    const carouselData = fs.existsSync(dataPath)
      ? require("../../../../../src/data/carousel.ts").carouselFilms
      : [];

    // Find the film to delete
    const filmToDelete = carouselData.find((f: any) => f.tmdbId === filmId);
    if (!filmToDelete) {
      return;
    }

    // Delete associated image
    if (filmToDelete.backdropImage) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        filmToDelete.backdropImage,
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Update carousel data
    const updatedFilms = carouselData.filter((f: any) => f.tmdbId !== filmId);

    // Write updated data back to file
    const fileContent = `// Auto-generated carousel data
export const carouselFilms = ${JSON.stringify(updatedFilms, null, 2)};`;

    fs.writeFileSync(dataPath, fileContent);

    revalidateTag("carousel");
    revalidatePath("/admin/carousel");
    revalidatePath("/");

    return true;
  } catch (error) {
    console.error("Error deleting film:", error);
    throw error;
  }
});

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
