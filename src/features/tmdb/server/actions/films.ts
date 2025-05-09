"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
const baseUrl: string = `https://api.themoviedb.org/3`;
import { TMDBFilm } from "@/types/films";

export const fetchTrending = cache(
  async (mediaType: "movie" | "tv", page: number) => {
    const trendingUrl = `${baseUrl}/trending/${mediaType}/week?language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`;

    try {
      const response = await fetch(trendingUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
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
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
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

        console.log(`Fetched ${allFilms.length} ${media_type} films`);
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
      `https://api.themoviedb.org/3/${media_type}/${tmdbId}?append_to_response=recommendations,credits,videos&api_key=${process.env.TMDB_API_KEY}`,
      {
        cache: "force-cache",
      },
    );
    const film = await res.json();

    const similar = film.recommendations.results;

    const recommendations = similar.slice(0, 8);

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

    return { recommendations, cast, trailerUrl, video_id };
  },
);
