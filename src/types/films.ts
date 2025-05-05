export type CarouselFilm = {
  tmdbId: number;
  title: string;
  contentType: string;
  runtime: string | null;
  seasons?: number;
  overview: string;
  backdropImage: string;
  vote_average: number;
  genres: {
    name: string;
  }[];
};

export interface TMDBFilm {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  release_date?: string;
  vote_average: number;
  first_air_date?: string;
}
