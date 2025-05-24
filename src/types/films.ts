import { Film } from "@/drizzle/schema";

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
  year?: number;
  rating?: number;
}
