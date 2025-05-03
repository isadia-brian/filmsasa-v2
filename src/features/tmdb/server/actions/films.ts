"use server";

import { cache } from "react";
const baseUrl: string = `https://api.themoviedb.org/3`;

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

export const fetchDiscover = cache(
  async (media_type: "movie" | "tv", watch_provider: string) => {
    return;
  },
);

//    `https://api.themoviedb.org/3/discover/${tmdbCategory}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=US&with_original_language=en&with_watch_providers=${stringedId}&api_key=${process.env.TMDB_API_KEY}`,
