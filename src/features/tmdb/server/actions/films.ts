"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { TMDBFilm } from "@/types/films";
import { convertMinutes, convertYear } from "@/lib/formatters";
import { posterURL } from "@/lib/utils";

const baseUrl: string = `https://api.themoviedb.org/3`;

export const searchFilmByName = async (
  media_type: "movie" | "tv",
  query: string,
) => {
  const response = await fetch(
    `${baseUrl}/search/${media_type}?query=${encodeURIComponent(
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
    `${baseUrl}/search/multi?query=${encodeURIComponent(
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
      name?: string;
      title?: string;
      media_type: string;
      profile_path?: string;
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

export const fetchFeatured = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    try {
      let url: string = "";

      if (mediaType === "movie") {
        url = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_original_language=en&api_key=${process.env.TMDB_API_KEY}`;
      } else {
        url = `${baseUrl}/discover/tv?first_air_date.gte=2020-01-01&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=US&with_original_language=en&without_genres=10767%2C10763%2C10764%2C99%2C10762&api_key=${process.env.TMDB_API_KEY}`;
      }
      const response = await fetch(url);
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
            backdrop_path,
            title,
            release_date,
            first_air_date,
            overview,
            name,
            vote_average,
            genre_ids = [],
          }: {
            id: number;
            poster_path: string;
            title?: string;
            name?: string;
            overview: string;
            backdrop_path: string;
            release_date?: string;
            first_air_date?: string;
            vote_average: number;
            genre_ids?: number[];
          }) => ({
            tmdbId: id,
            title: typeof title === "string" ? title : name,
            poster_path,
            backdrop_path,
            mediaType,
            year:
              typeof release_date === "string"
                ? convertYear(release_date)
                : typeof first_air_date === "string"
                  ? convertYear(first_air_date)
                  : 0,
            vote_average,
            rating: Math.round(vote_average * 10) / 10,
            genres: genre_ids
              .map((id) => genreMap.get(id)) //convert id to name
              .filter((name): name is string => name !== undefined),
            overview,
          }),
        )
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
            backdrop_path,
            title,
            release_date,
            first_air_date,
            overview,
            name,
            vote_average,
            genre_ids = [],
          }: {
            id: number;
            poster_path: string;
            title?: string;
            name?: string;
            overview: string;
            backdrop_path: string;
            release_date?: string;
            first_air_date?: string;
            vote_average: number;
            genre_ids?: number[];
          }) => ({
            tmdbId: id,
            title: typeof title === "string" ? title : name,
            poster_path,
            backdrop_path,
            mediaType,
            release_date,
            first_air_date,
            year:
              typeof release_date === "string"
                ? convertYear(release_date)
                : typeof first_air_date === "string"
                  ? convertYear(first_air_date)
                  : 0,
            vote_average,
            rating: Math.round(vote_average * 10) / 10,
            genres: genre_ids
              .map((id) => genreMap.get(id)) //convert id to name
              .filter((name): name is string => name !== undefined),
            overview,
          }),
        )
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
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&watch_region=US&vote_average.gte=4&with_origin_country=US&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${process.env.TMDB_API_KEY}&page=`;
      } else if (media_type === "tv") {
        discoverUrl = `${baseUrl}/discover/tv?include_adult=false&include_video=false&language=en-US&watch_region=US&first_air_date.gte=2020-01-01&sort_by=popularity.desc&with_original_language=en&without_genres=16%2C10763%2C10767&api_key=${process.env.TMDB_API_KEY}&page=`;
      } else {
        discoverUrl = `${baseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&region=US&sort_by=popularity.desc&with_genres=16%2C10751&with_original_language=en&without_genres=10749%2C27%2C36%2C80%2C99%2C36%2C53%2C37&api_key=${process.env.TMDB_API_KEY}&page=`;
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
          `${baseUrl}/tv/${tmdbId}/season/${i + 1}?language=en-US&api_key=${process.env.TMDB_API_KEY}`,
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

export const fetchFilmGenres = cache(
  async (mediaType: "movie" | "tv" = "movie") => {
    try {
      const EXCLUDED_GENRE_IDS: number[] = [16, 10763, 10767];

      const response = await fetch(
        `${baseUrl}/genre/${mediaType}/list?language=en&api_key=${process.env.TMDB_API_KEY}`,
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

export const fetchSectionFilms = unstable_cache(
  async () => {
    const [moviesData, seriesData, kidsData] = await Promise.all([
      fetchFilms("movie"),
      fetchFilms("tv"),
      fetchFilms("kids"),
    ]);
    let movies = moviesData.allFilms.slice(0, 7);
    movies = movies.map((movie) => {
      return {
        tmdbId: movie.id,
        contentType: "movie",
        title: movie.title,
        posterImage: posterURL(movie.poster_path),
      };
    });
    let series = seriesData.allFilms.slice(0, 7);
    series = series.map((film) => {
      return {
        tmdbId: film.id,
        contentType: "tv",
        title: film.name,
        posterImage: posterURL(film.poster_path),
      };
    });

    let kids = kidsData.allFilms.slice(0, 7);
    kids = kids.map((movie) => {
      return {
        tmdbId: movie.id,
        contentType: "kids",
        title: movie.title,
        posterImage: posterURL(movie.poster_path),
      };
    });
    const allFilms = [...movies, ...series, ...kids];

    return allFilms;
  },
  ["section_films"],
  { revalidate: 60 * 60 * 60 },
);

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },

  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },

  {
    id: 10759,
    name: "Action & Adventure",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
  },
  {
    id: 10766,
    name: "Soap",
  },
  {
    id: 37,
    name: "Western",
  },
];

// Map for genre ID to name lookup
const genreMap = new Map<number, string>();
genres.forEach((genre) => {
  genreMap.set(genre.id, genre.name);
});
