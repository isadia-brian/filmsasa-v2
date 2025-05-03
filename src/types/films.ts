type CarouselFilm = {
  tmdbId: number;
  title: string;
  contentType: string;
  runtime: string | null;
  seasons?: number;
  overview: string;
  backdropImage: string;
  genres: {
    name: string;
  }[];
};
