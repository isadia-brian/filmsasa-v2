export type CarouselFilm = {
  tmdbId: number;
  title: string;
  contentType: string;
  runtime: string | null;
  seasons: number | null;
  overview: string;
  backdropImage: string;
  rating: number;
  genres: string[];
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
