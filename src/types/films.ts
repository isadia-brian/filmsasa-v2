type CarouselFilm = {
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
