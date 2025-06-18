export const getContentLink = (
  contentType: "movie" | "tv" | "kids",
  tmdbId: number
) => {
  switch (contentType) {
    case "tv":
      return `/series/${tmdbId}`;
    case "movie":
      return `/movies/${tmdbId}`;
    case "kids":
      return `/kids/${tmdbId}`;
    default:
      return "/";
  }
};
