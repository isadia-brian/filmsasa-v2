"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  FeaturedFilms,
  FilmByName,
  FilmDetails,
  SearchContent,
  TMDBFilm,
} from "@/types/films";
import { convertMinutes, convertYear } from "@/lib/formatters";
import { mapFilmResults, posterURL } from "@/lib/utils";

const baseUrl: string = `https://api.themoviedb.org/3`;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const searchFilmByName = cache(
  async (media_type: "movie" | "tv", query: string) => {
    const response = await fetch(
      `${baseUrl}/search/${media_type}?query=${encodeURIComponent(
        query,
      )}&include_adult=false&language=en-US&page=1&api_key=${TMDB_API_KEY}`,
    );

    const { results } = await response.json();
    return results
      .map((film: FilmByName) => mapFilmResults(film))
      .filter(({ vote_average }: { vote_average: number }) => vote_average > 0);
  },
);

export const searchContent = cache(async (query: string) => {
  const response = await fetch(
    `${baseUrl}/search/multi?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1&api_key=${TMDB_API_KEY}`,
  );
  const { results } = await response.json();
  return results.map((film: SearchContent) => mapFilmResults(film));
});

export const fetchFeatured = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    try {
      let url: string = "";

      if (mediaType === "movie") {
        url = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_original_language=en&api_key=${TMDB_API_KEY}`;
      } else {
        url = `${baseUrl}/discover/tv?first_air_date.gte=2020-01-01&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=US&with_original_language=en&without_genres=10767%2C10763%2C10764%2C99%2C10762&api_key=${TMDB_API_KEY}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP ${response.status} - ${response.statusText}`);
        return;
      }
      const { results } = await response.json();
      if (!results) return;

      return results
        .map((film: FeaturedFilms) => mapFilmResults(film))
        .filter(
          ({ vote_average }: { vote_average: number }) => vote_average >= 5,
        );
    } catch (error) {
      console.log(`An error occurred on the server: ${error}`);
      return;
    }
  },
);

export const fetchPopular = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    const popularUrl = `${baseUrl}/${mediaType}/popular?language=en-US&page=${page}&api_key=${TMDB_API_KEY}`;

    try {
      const response = await fetch(popularUrl);
      if (!response.ok) {
        console.error(`HTTP ${response.status} - ${response.statusText}`);
        return;
      }

      const { results } = await response.json();
      if (!results) return;

      return results
        .map((film: FeaturedFilms) => mapFilmResults(film))
        .filter(
          ({ vote_average }: { vote_average: number }) => vote_average >= 5,
        );
    } catch (error) {
      console.error(error);
      return;
    }
  },
);

export const fetchFilms = cache(
  unstable_cache(
    async (media_type: string) => {
      let allFilms = [];
      let discoverUrl = "";
      if (media_type === "movie") {
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&vote_average.gte=4&with_origin_country=US&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${TMDB_API_KEY}&page=`;
      } else if (media_type === "tv") {
        discoverUrl = `${baseUrl}/discover/tv?include_adult=false&include_video=false&language=en-US&watch_region=US&first_air_date.gte=2020-01-01&sort_by=popularity.desc&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${TMDB_API_KEY}&page=`;
      } else {
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${TMDB_API_KEY}&page=`;
      }
      const urls = Array.from(
        { length: 10 },
        (_, i) => `${discoverUrl}${i + 1}`,
      );

      try {
        const pages = await Promise.all(
          urls.map((url) =>
            fetch(url)
              .then((res) => res.json())
              .catch((error) => {
                console.error("Fetch error:", error);
                return { results: [] };
              }),
          ),
        );

        allFilms = pages.flatMap((page) => page.results);
        const data = allFilms
          .map((film) => {
            return {
              id: film.id,
              title: film.title || film.name,
              poster_path: film.poster_path,
              year:
                typeof film.release_date === "string"
                  ? convertYear(film.release_date)
                  : typeof film.first_air_date === "string"
                    ? convertYear(film.first_air_date)
                    : 0,
              vote_average: Math.round(film.vote_average),
            };
          })
          .filter((film) => film.year < 2026);

        return {
          data,
          totalCount: allFilms.length,
        };
      } catch (error) {
        console.error("Global error:", error);
        return { allFilms: [], totalCount: 0 };
      }
    },
    ["tmdb-provider-data"],
    {
      tags: ["tmdb-data"],
      revalidate: 3600,
    },
  ),
);

export const fetchProvider = cache(
  unstable_cache(
    async (media_type: string, watch_provider: string) => {
      let allFilms: TMDBFilm[] = [];
      const discoverUrl = `${baseUrl}/discover/${media_type}?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&with_watch_providers=${watch_provider}&api_key=${TMDB_API_KEY}&page=`;

      const urls = Array.from(
        { length: 10 },
        (_, i) => `${discoverUrl}${i + 1}`,
      );

      try {
        const pages = await Promise.all(
          urls.map((url) =>
            fetch(url)
              .then((res) => res.json())
              .catch((error) => {
                console.error("Fetch error:", error);
                return { results: [] };
              }),
          ),
        );

        allFilms = pages.flatMap((page) => page.results);

        return {
          allFilms,
          totalCount: allFilms.length,
        };
      } catch (error) {
        console.error("Global error:", error);
        return { allFilms: [], totalCount: 0 };
      }
    },
    ["tmdb-provider-data"],
    {
      tags: ["tmdb-data"],
      revalidate: 3600,
    },
  ),
);

export const searchFilm = cache(
  async (media_type: "movie" | "tv", filmId: number) => {
    const url = `${baseUrl}/${media_type}/${filmId}?language=en-US&api_key=${TMDB_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();
      if (!data) return;

      const {
        id,
        original_title,
        original_name,
        genres: genreObjects,
        first_air_date,
        release_date,
        overview,
        runtime: movieDuration,
        poster_path,
        backdrop_path,
        number_of_seasons,
        vote_average,
      } = data;

      let humanizedDuration: string | null = null;
      let year: number | null = null;

      if (media_type === "movie") {
        humanizedDuration = convertMinutes(movieDuration);
        year = parseInt(release_date.split("-")[0]);
      } else {
        humanizedDuration = null;
        year = parseInt(first_air_date.split("-")[0]);
      }

      const genres = genreObjects.map(({ name }: { name: string }) => name);

      const film = {
        tmdbId: id,
        title: original_name || original_title,
        overview,
        genres,
        posterImage: poster_path,
        backdropImage: backdrop_path,
        seasons: number_of_seasons,
        runtime: humanizedDuration,
        year,
        rating: Math.round(vote_average),
        media_type,
      };

      return film;
    } catch (error) {
      console.log(`There was a server error: ${error}`);
      return;
    }
  },
);

export const fetchFilmGenres = cache(
  async (mediaType: "movie" | "tv" = "movie") => {
    try {
      const EXCLUDED_GENRE_IDS: number[] = [16, 10763, 10767];

      const response = await fetch(
        `${baseUrl}/genre/${mediaType}/list?language=en&api_key=${TMDB_API_KEY}`,
      );

      const { genres: genreObjects } = await response.json();

      const filteredGenres = genreObjects.filter(
        (genre: { id: number; name: string }) =>
          !EXCLUDED_GENRE_IDS.includes(genre.id),
      );

      const genres = filteredGenres.map(
        (genre: { name: string }) => genre.name,
      );

      return genres ?? [];
    } catch (error) {
      console.log(`An error occurred while fetching genres, ${error}`);
      return [];
    }
  },
);

export const fetchLandingFilms = cache(
  async (media_type: "movie" | "tv" | "kids") => {
    let discoverUrl = "";
    if (media_type === "movie") {
      discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&vote_average.gte=4&with_origin_country=US&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${TMDB_API_KEY}&page=1`;
    } else if (media_type === "tv") {
      discoverUrl = `${baseUrl}/discover/tv?include_adult=false&include_video=false&language=en-US&watch_region=US&first_air_date.gte=2020-01-01&sort_by=popularity.desc&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${TMDB_API_KEY}&page=1`;
    } else {
      discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${TMDB_API_KEY}&page=1`;
    }

    try {
      const response = await fetch(discoverUrl);
      if (!response.ok) {
        console.log("Failed to get data from TMDB");
        return;
      }
      const { results } = await response.json();
      let data = results.slice(0, 7);
      data = data.map(
        (film: {
          id: number;
          title?: string;
          poster_path: string;
          name?: string;
          release_date?: string;
          first_air_date?: string;
        }) => {
          return {
            tmdbId: film.id,
            title: film.title || film.name,
            posterImage: posterURL(film.poster_path),
            contentType: media_type,
            year:
              typeof film.release_date === "string"
                ? convertYear(film.release_date)
                : typeof film.first_air_date === "string"
                  ? convertYear(film.first_air_date)
                  : 0,
          };
        },
      );
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  },
);

export const fetchSectionFilms = unstable_cache(
  async () => {
    const [movies, series, kidsData] = await Promise.all([
      fetchLandingFilms("movie"),
      fetchLandingFilms("tv"),
      fetchLandingFilms("kids"),
    ]);
    const kids = kidsData.sort(
      (a: { year: number }, b: { year: number }) => b.year - a.year,
    );
    const allFilms = [...movies, ...series, ...kids];

    return allFilms;
  },
  ["section_films"],
  { revalidate: 60 * 60 * 60 },
);

export const fetchTmdbData = cache(
  async (tmdbId: number, mediaType: "movie" | "tv") => {
    const url = `${baseUrl}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.statusText}`);
    }

    const { runtime, number_of_seasons } = await response.json();

    return {
      runtime,
      number_of_seasons,
    };
  },
);

export const fetchTmdbImage = cache(
  async (imagePath: string, width: string) => {
    if (!imagePath) {
      throw new Error("Image path is required");
    }

    const url = `https://image.tmdb.org/t/p/${width}${imagePath}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  },
);

export const fetchFilmDetails = cache(
  async ({ mediaType, tmdbId }: { mediaType: string; tmdbId: number }) => {
    try {
      const response = await fetch(
        `${baseUrl}/${mediaType}/${tmdbId}?append_to_response=recommendations,${
          mediaType === "tv" ? "aggregate_credits" : "credits"
        },videos&api_key=${TMDB_API_KEY}`,
      );
      const film = await response.json();

      const title = film.title || film.name;
      const overview = film.overview;
      const backdropImage = film.backdrop_path;
      const posterImage = film.poster_path;

      const similar = film.recommendations.results;

      const recommendations = similar.slice(0, 5);
      const vote_average = film.vote_average;

      let seasons: number = 0;
      let year: number | null = null;
      let runtime: string = "";

      let seriesData: FilmDetails["seriesData"] | null = {
        seasons: null,
        episodes: null,
      };

      let trailerUrl: string | null = "";
      let videoId: string | null = "";

      const genres = film.genres.map((g: { name: string }) => g.name);
      const credits =
        mediaType === "tv" ? film.aggregate_credits.cast : film.credits.cast;

      const actors = credits
        .filter(
          (star: { known_for_department: string }) =>
            star.known_for_department === "Acting",
        )
        .map(
          (actor: {
            profile_path: string;
            name: string;
            character?: string;
            roles: {
              character: string;
            }[];
          }) => {
            return {
              name: actor.name,
              profile_path: actor.profile_path,
              character:
                mediaType === "tv" ? actor.roles[0].character : actor.character,
            };
          },
        );

      const cast = actors.slice(0, 20);

      if (mediaType === "tv") {
        seasons = parseInt(film.number_of_seasons);
        year = parseInt(film.first_air_date.split("-")[0]);
        const data = await fetchSeriesData(mediaType, seasons, tmdbId);

        if (data !== null) {
          seriesData = data;
        } else {
          seriesData = null;
        }
      } else {
        seriesData = null;
        year = parseInt(film.release_date.split("-")[0]);
        runtime = convertMinutes(film.runtime);
      }

      const trailer = film.videos.results.find(
        (video: { name: string; site: string }) =>
          video.name.toLowerCase().includes("trailer") &&
          video.site === "YouTube",
      );

      if (!trailer) {
        trailerUrl = null;
        videoId = null;
      } else {
        trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        videoId = trailer.key;
      }

      const video = {
        trailerUrl,
        videoId,
      };

      return {
        tmdbId,
        title,
        overview,
        year,
        recommendations,
        mediaType,
        genres,
        video,
        backdropImage,
        posterImage,
        runtime,
        vote_average,
        seriesData,
        cast,
      };
    } catch (error) {
      console.log(error);
      return;
    }
  },
);

export const fetchSeriesData = async (
  media_type: "tv",
  seasons: number,
  tmdbId: number,
): Promise<FilmDetails["seriesData"] | null> => {
  const tvData: FilmDetails["seriesData"] = {
    seasons: null,
    episodes: [],
  };

  const seasonUrls = Array.from(
    { length: seasons },
    (_, i) =>
      `${baseUrl}/${media_type}/${tmdbId}/season/${
        i + 1
      }?language=en-US&api_key=${TMDB_API_KEY}`,
  );

  try {
    // Fetch all seasons in parallel
    const seasonResponses = await Promise.all(
      seasonUrls.map((url) =>
        fetch(url).catch((err) => {
          console.error(`Season fetch failed: ${err.message}`);
          return null;
        }),
      ),
    );

    // Process responses in parallel
    const episodeDataPromises = seasonResponses
      .filter((response): response is Response => response !== null)
      .map(async (response) => {
        try {
          const { episodes } = await response.json();

          if (episodes?.length > 0) {
            return episodes.map(
              (episode: {
                episode_number: number;
                id: number;
                name: string;
                still_path: string;
                season_number: number;
              }) => ({
                episode_number: episode.episode_number,
                id: episode.id,
                name: episode.name,
                still_path: episode.still_path,
                season_number: episode.season_number,
              }),
            );
          }
          return [];
        } catch (error) {
          console.error(`Episode processing failed: ${error}`);
          return [];
        }
      });

    // Wait for all episode processing to complete
    const allEpisodeData = await Promise.all(episodeDataPromises);

    // Flatten and assign results
    tvData.episodes = allEpisodeData.flat();
    tvData.seasons = seasons;

    return tvData;
  } catch (error) {
    console.error(`Critical series data fetch error: ${error}`);
    return null;
  }
};
