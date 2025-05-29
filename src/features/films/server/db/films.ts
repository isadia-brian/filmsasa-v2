"use server";

import { db } from "@/db";
import { filmCategories, films, InsertFilm, type Film } from "@/db/schema";
import { eq, and, lte, gte, isNotNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { convertMinutes } from "@/lib/formatters";
import { revalidatePath, revalidateTag } from "next/cache";
import { TMDBFilmData } from "@/types/films";

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
      orderBy: (films, { asc }) => [asc(films.created_at)],
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
        return result?.rowCount > 0;
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

// export const addToCarousel = async (
//   filmId: number,
//   mediaType: "movie" | "tv",
// ) => {
//   try {
//     const movieDataReq = await fetch(
//       `https://api.themoviedb.org/3/${mediaType}/${filmId}?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
//     );
//     const {
//       title: movieTitle,
//       name: tvTitle,
//       overview,
//       backdrop_path,
//       runtime: movieRuntime,
//       number_of_seasons: seasons,
//       genres: genreObjects,
//     } = await movieDataReq.json();
//
//     const title = movieTitle || tvTitle;
//     let runtime: string | null = null;
//     if (!movieRuntime) {
//       runtime = null;
//     } else {
//       runtime = convertMinutes(movieRuntime);
//     }
//     const genres = genreObjects.map(({ name }: { name: string }) => ({ name }));
//
//     // Helper function to sanitize titles for filenames
//     const sanitizeFileName = (title: string) =>
//       title
//         .toLowerCase()
//         .replace(/\s+/g, "_") // Replace spaces with underscores
//         .replace(/[^\w-]/g, ""); // Remove non-alphanumeric characters
//
//     const response = await fetch(backdropURL(backdrop_path));
//     const arrayBuffer = await response.arrayBuffer();
//     const posterBuffer = Buffer.from(arrayBuffer);
//
//     // Create directory if it doesn't exist
//     const publicDir = path.join(process.cwd(), "public", "carousel");
//     if (!fs.existsSync(publicDir)) {
//       fs.mkdirSync(publicDir, { recursive: true });
//     }
//
//     // Save image to filesystem
//     const fileName = `${sanitizeFileName(title)}.jpg`;
//     const filePath = path.join(publicDir, fileName);
//     fs.writeFileSync(filePath, posterBuffer);
//
//     // Create film object with image path
//     const film = {
//       tmdbId: filmId,
//       title,
//       contentType: mediaType,
//       runtime,
//       seasons,
//       overview,
//       backdropImage: `/carousel/${fileName}`,
//       genres,
//     };
//
//     // Add to carousel data
//     const dataPath = path.join(process.cwd(), "src", "data");
//     if (!fs.existsSync(dataPath)) {
//       console.log(`Creating directory ${dataPath}`);
//       fs.mkdirSync(dataPath, { recursive: true });
//
//       console.log(`Created directory ${dataPath} successfully`);
//     }
//     const carouselFile = "carousel.ts";
//     const fullDataPath = path.join(dataPath, carouselFile);
//
//     const carouselData = fs.existsSync(fullDataPath)
//       ? require("../../../../../src/data/carousel.ts").carouselFilms
//       : [];
//
//     // Avoid duplicates
//     if (!carouselData.some((f: any) => f.tmdbId === film.tmdbId)) {
//       const updatedFilms = [...carouselData, film];
//
//       // Create data directory if it doesn't exist
//       const dataDir = path.dirname(fullDataPath);
//       if (!fs.existsSync(dataDir)) {
//         fs.mkdirSync(dataDir, { recursive: true });
//       }
//
//       // Write formatted TypeScript file
//       const fileContent = `// Auto-generated carousel data
// export const carouselFilms = ${JSON.stringify(updatedFilms, null, 2)};`;
//
//       fs.writeFileSync(fullDataPath, fileContent);
//       console.log("Successfully updated carousel data");
//     }
//
//     revalidateTag("carousel");
//     revalidatePath("/admin/carousel");
//     revalidatePath("/");
//
//     return film;
//   } catch (error) {
//     console.error("Error processing movie:", error);
//     throw error;
//   }
// };
//
// export const deleteFromCarousel = cache(async (filmId: number) => {
//   try {
//     const dataPath = path.join(process.cwd(), "src", "data", "carousel.ts");
//
//     // Read current carousel data
//     const carouselData = fs.existsSync(dataPath)
//       ? require("../../../../../src/data/carousel.ts").carouselFilms
//       : [];
//
//     // Find the film to delete
//     const filmToDelete = carouselData.find((f: any) => f.tmdbId === filmId);
//     if (!filmToDelete) {
//       return;
//     }
//
//     // Delete associated image
//     if (filmToDelete.backdropImage) {
//       const imagePath = path.join(
//         process.cwd(),
//         "public",
//         filmToDelete.backdropImage,
//       );
//
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }
//
//     // Update carousel data
//     const updatedFilms = carouselData.filter((f: any) => f.tmdbId !== filmId);
//
//     // Write updated data back to file
//     const fileContent = `// Auto-generated carousel data
// export const carouselFilms = ${JSON.stringify(updatedFilms, null, 2)};`;
//
//     fs.writeFileSync(dataPath, fileContent);
//
//     revalidateTag("carousel");
//     revalidatePath("/admin/carousel");
//     revalidatePath("/");
//
//     return true;
//   } catch (error) {
//     console.error("Error deleting film:", error);
//     throw error;
//   }
// });

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

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchTmdbData(tmdbId: number, mediaType: "movie" | "tv") {
  const url = `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  const { runtime, number_of_seasons } = await response.json();

  return {
    runtime,
    number_of_seasons,
  };
}

async function fetchTmdbImage(imagePath: string, width: string) {
  if (!imagePath) {
    throw new Error("Image path is required");
  }

  const url = `https://image.tmdb.org/t/p/${width}${imagePath}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function insertFilmFromTmdb(
  tmdbFilm: TMDBFilmData,
  category: string,
): Promise<{
  message: string;
  action: "none" | "category_added" | "film_created";
}> {
  try {
    // 1. Fetch TMDB data
    const tmdbData = await fetchTmdbData(tmdbFilm.tmdbId, tmdbFilm.mediaType);

    // 2. Validate required image paths
    if (!tmdbFilm.poster_path) {
      throw new Error("TMDB poster path is missing");
    }
    if (!tmdbFilm.backdrop_path) {
      throw new Error("TMDB backdrop path is missing");
    }

    // 3. Fetch images with specified dimensions
    const [posterBlob, backdropBlob] = await Promise.all([
      fetchTmdbImage(tmdbFilm.poster_path, "w500"), // Poster width 500px
      fetchTmdbImage(tmdbFilm.backdrop_path, "w1280"), // Backdrop width 1280px
    ]);

    const genres = tmdbFilm.genres;
    const rating = Math.round(tmdbFilm.rating);

    // 4. Prepare film data
    const filmData: InsertFilm = {
      tmdbId: tmdbFilm.tmdbId,
      title: tmdbFilm.title,
      overview: tmdbFilm.overview,
      contentType: tmdbFilm.mediaType,
      mediaType: tmdbFilm.mediaType,
      genres,
      year: tmdbFilm.year,
      posterImage: tmdbFilm.poster_path,
      backdropImage: tmdbFilm.backdrop_path,
      rating,
      seasons: tmdbFilm.mediaType === "tv" ? tmdbData.number_of_seasons : null,
      runtime:
        tmdbFilm.mediaType === "movie"
          ? convertMinutes(tmdbData.runtime)
          : null,
      quality: "HD",
    };

    // 5. Insert into database
    return await db.transaction(async (tx) => {
      // Check for existing film
      // Check for existing film
      const existingFilm = await tx.query.films.findFirst({
        where: eq(films.tmdbId, tmdbFilm.tmdbId),
      });

      if (existingFilm) {
        // Check if category already exists for this film
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

        // Add new category to existing film
        await tx.insert(filmCategories).values({
          filmTmdbId: existingFilm.tmdbId,
          category,
        });

        revalidateTag(category);
        revalidatePath("/");
        revalidatePath(`/admin/${category}`);

        return {
          message: `Added  new category ${category} to film ${tmdbFilm.title}`,
          action: "category_added",
        };
      }

      // Insert new film and category
      const [insertedFilm] = await tx
        .insert(films)
        .values(filmData)
        .returning();

      await tx.insert(filmCategories).values({
        filmTmdbId: insertedFilm.tmdbId,
        category,
      });

      revalidateTag(category);
      revalidatePath("/");
      revalidatePath(`/admin/${category}`);
      return {
        message: `New film ${tmdbFilm.title} created with category ${category}`,
        action: "film_created",
      };
    });
  } catch (error) {
    return {
      message: `An error occured on the server ${error}`,
      action: "none",
    };
  }
}
