import { Film } from "@/db/schema";

export interface FilmType {
  posterImage?: string | null | undefined;
  title?: string | undefined;
  contentType?: "movie" | "tv" | undefined;
  tmdbId?: number | undefined;
  filmCategories?: Film["filmCategories"];
  filterCategory?: string;
}

export type FilmCategory = {
  filmTmdbId: number;
  category: string;
  created_at: Date;
  updated_at: Date;
};

export type FilmWithDataURLs = Omit<Film, "posterImage" | "backdropImage"> & {
  posterImage: string;
  backdropImage: string;
  filmCategories?: Pick<FilmCategory, "category">[]; // Simplified category
};

export type TMDBFilm = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  vote_average: number;
  first_air_date?: string;
};

export interface FilmCardProps {
  section?: boolean;
  content?: boolean;
  page?: string;
  film: {
    tmdbId: number;
    title: string;
    posterImage: string;
    contentType: "movie" | "tv" | "kids";
    rating?: number;
    mediaType?: string;
    year?: number;
  };
}

export interface FilmData {
  title: string;
  mediaType: "movie" | "tv";
  posterImage?: string;
  tmdbPosterUrl: string;
  year?: number;
  rating?: number;
}

export interface TMDBFilmData {
  tmdbId: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  mediaType: "movie" | "tv";
  year: number;
  rating: number;
  genres: string[];
  overview: string;
}

export interface FilmDetails {
  tmdbId: number;
  title: string;
  overview: string;
  genres: string[];
  posterImage: string;
  backdropImage: string;
  year: number;
  mediaType: "movie" | "tv";
  vote_average: number;
  runtime?: string;
  recommendations:
    | {
        id: number;
        title?: string;
        name?: string;
        backdrop_path: string;
        media_type: string;
      }[]
    | null;
  cast?:
    | {
        name: string;
        profile_path: string;
        roles: {
          character: string;
        }[];
        character?: string;
      }[]
    | null;
  video: {
    trailerUrl: string | null;
    videoId: string | null;
  } | null;
  seriesData: {
    seasons: number | null;
    episodes:
      | {
          episode_number: number;
          id: number;
          name: string;
          still_path: string;
          season_number: number;
        }[]
      | null;
  } | null;
}

export interface MappedFilm {
  tmdbId: number;
  title: string | null;
  poster_path: string | null;
  year?: number;
  vote_average: number;
  rating: number;
  genres?: string[];
  overview: string;
  media_type?: string;
  profile_path?: string;
  backdrop_path?: string;
}

export interface FilmByName {
  tmdbId: number;
  poster_path: string;
  name: string;
  title: string;
  vote_average: string;
  release_date: string;
  first_air_date: string;
}

export interface SearchContent {
  tmdbId: number;
  poster_path?: string;
  name?: string;
  profile_path?: string;
  title?: string;
  media_type: string;
}

export interface FeaturedFilms {
  tmdbId: number;
  poster_path: string;
  name?: string;
  title?: string;
  vote_average: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  overview: string;
  backdrop_path?: string;
}
