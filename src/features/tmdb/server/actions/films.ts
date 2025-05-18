"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { TMDBFilm } from "@/types/films";
import { convertMinutes } from "@/lib/formatters";

const baseUrl: string = `https://api.themoviedb.org/3`;

export const searchFilmByName = async (
  media_type: "movie" | "tv",
  query: string,
) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/${media_type}?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1&api_key=${process.env.TMDB_API_KEY}`,
  );

  const { results } = await response.json();
  return results
    .map(
      ({
        id,
        poster_path,
        title,
        name,
        vote_average,
        profile_path,
        release_date,
        first_air_date,
      }: {
        id: string;
        poster_path: string;
        name: string;
        profile_path: string;
        title: string;
        vote_average: string;
        release_date: string;
        first_air_date: string;
      }) => ({
        id,
        poster_path,
        title,
        name,
        profile_path,
        vote_average,
        release_date,
        first_air_date,
      }),
    )
    .filter(({ vote_average }: { vote_average: number }) => vote_average > 0);
};

export async function searchContent(query: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
      query,
    )}&include_adult=false&language=en-US&page=1&api_key=${process.env.TMDB_API_KEY}`,
  );
  const { results } = await response.json();
  return results.map(
    ({
      id,
      poster_path,
      title,
      name,
      media_type,
      profile_path,
    }: {
      id: string;
      poster_path: string;
      name: string;
      media_type: string;
      profile_path: string;
      title: string;
    }) => ({
      id,
      poster_path,
      title,
      media_type,
      name,
      profile_path,
    }),
  );
}

export const fetchTrending = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    const trendingUrl = `${baseUrl}/trending/${mediaType}/week?language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`;

    try {
      const response = await fetch(trendingUrl);
      if (!response.ok) {
        console.error(`HTTP ${response.status} - ${response.statusText}`);
        return;
      }

      const { results } = await response.json();
      if (!results) return;

      return results
        .map(
          ({
            id,
            media_type,
            poster_path,
            title,
            name,
            original_language,
            vote_average,
          }: {
            id: string;
            poster_path: string;
            media_type: string;
            title: string;
            name: string;
            original_language: string;
            vote_average: number;
          }) => ({
            id,
            poster_path,
            title,
            name,
            media_type,
            original_language,
            vote_average,
          }),
        )
        .filter(
          ({
            original_language,
            vote_average,
          }: {
            original_language: string;
            vote_average: number;
          }) => original_language === "en" && vote_average >= 5,
        );
    } catch (error) {
      console.error(error);
      throw new Error("An error occured while fetching");
    }
  },
);

export const fetchPopular = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    const popularUrl = `${baseUrl}/${mediaType}/popular?language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`;

    try {
      const response = await fetch(popularUrl);
      if (!response.ok) {
        console.error(`HTTP ${response.status} - ${response.statusText}`);
        return;
      }

      const { results } = await response.json();
      if (!results) return;

      return results
        .map(
          ({
            id,
            poster_path,
            title,
            name,
            original_language,
            vote_average,
          }: {
            id: string;
            poster_path: string;
            title: string;
            name: string;
            original_language: string;
            vote_average: number;
          }) => ({
            id,
            poster_path,
            title,
            name,
            media_type: mediaType,
            original_language,
            vote_average,
          }),
        )
        .filter(
          ({
            original_language,
            vote_average,
          }: {
            original_language: string;
            vote_average: number;
          }) => original_language === "en" && vote_average >= 5,
        );
    } catch (error) {
      console.error(error);
      throw new Error("An error occured while fetching");
    }
  },
);

export const fetchFilms = cache(
  unstable_cache(
    async (media_type: string) => {
      let allFilms = [];
      let discoverUrl = "";
      if (media_type === "movie") {
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&vote_average.gte=4&with_origin_country=US&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${process.env.TMDB_API_KEY}&page=`;
      } else if (media_type === "tv") {
        discoverUrl = `${baseUrl}/discover/tv?include_adult=false&include_video=false&language=en-US&watch_region=US&first_air_date.gte=2020-01-01&sort_by=popularity.desc&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${process.env.TMDB_API_KEY}&page=`;
      } else {
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${process.env.TMDB_API_KEY}&page=`;
      }
      const urls = Array.from(
        { length: 20 },
        (_, i) => `${discoverUrl}${i + 1}`,
      );

      try {
        const pages = await Promise.all(
          urls.map((url) =>
            fetch(url, { next: { tags: ["tmdb-data"] } })
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

export const fetchProvider = cache(
  unstable_cache(
    async (media_type: string, watch_provider: string) => {
      let allFilms: TMDBFilm[] = [];
      const discoverUrl = `${baseUrl}/discover/${media_type}?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&with_watch_providers=${watch_provider}&api_key=${process.env.TMDB_API_KEY}&page=`;

      const urls = Array.from(
        { length: 10 },
        (_, i) => `${discoverUrl}${i + 1}`,
      );

      try {
        const pages = await Promise.all(
          urls.map((url) =>
            fetch(url, { next: { tags: ["tmdb-data"] } })
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

export const fetchContent = cache(
  async (tmdbId: number, media_type: string) => {
    const res = await fetch(
      `${baseUrl}/${media_type}/${tmdbId}?append_to_response=recommendations,credits,similar,videos&api_key=${process.env.TMDB_API_KEY}`,
      {
        cache: "force-cache",
      },
    );
    const film = await res.json();

    const similar = film.recommendations.results;

    const recommendations = similar.slice(0, 5);

    let seasons: number | null = null;

    let seriesData = [];
    if (media_type === "tv") {
      seasons = film.number_of_seasons;
      seasons = Number(seasons);
      const urls = Array.from(
        { length: seasons },
        (_, i) =>
          `https://api.themoviedb.org/3/tv/${tmdbId}/season/${i + 1}?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
      );
      try {
        for (let i = 0; i < urls.length; i++) {
          try {
            const response = await fetch(urls[i]);
            if (!response.ok) {
              console.log(
                `Error fetching response: HTTP ${response.status} - ${response.statusText}`,
              );
            }
            const { episodes } = await response.json();

            if (episodes) {
              const data = episodes.map(
                ({
                  episode_number,
                  id,
                  name,
                  still_path,
                  season_number,
                }: {
                  episode_number: number;
                  id: number;
                  name: string;
                  still_path: string;
                  season_number: number;
                }) => ({ episode_number, id, name, still_path, season_number }),
              );
              seriesData.push(...data);
            }
          } catch (error) {
            console.log(`An error occurred: ${error}`);
          }
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      }
    } else {
      seasons = null;
    }

    const credits = film.credits.cast;
    const actors = credits
      .filter(
        (star: { known_for_department: string }) =>
          star.known_for_department === "Acting",
      )
      .map((actor: any) => {
        return actor;
      });

    const cast = actors.slice(0, 15);

    let trailerUrl: string | null = "";
    let video_id: string | null = "";

    const trailer = film.videos.results.find(
      (video: { name: string; site: string }) =>
        video.name.toLowerCase().includes("trailer") &&
        video.site === "YouTube",
    );

    if (!trailer) {
      trailerUrl = null;
      video_id = null;
    } else {
      trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      video_id = trailer.key;
    }

    return { recommendations, cast, trailerUrl, video_id, seasons, seriesData };
  },
);

export const searchFilm = cache(
  async (media_type: "movie" | "tv", filmId: number) => {
    const url = `${baseUrl}/${media_type}/${filmId}?language=en-US&api_key=${process.env.TMDB_API_KEY}`;

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
