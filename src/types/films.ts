export type Film = {
  tmdbId: number;
  title: string;
  overview: string;
  contentType: "movie" | "tv" | "kids";
  mediaType: "movie" | "tv";
  backdropImage: Uint8Array;
  posterImage: Uint8Array;
  genres: string[];
  year: number;
  quality: string;
  rating?: number | null;
  seasons?: number | null;
  runtime?: string | null;
  filmCategories?: FilmCategory[];
};

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
