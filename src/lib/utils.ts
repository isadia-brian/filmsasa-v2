import { type Film as DrizzleFilm } from "@/drizzle/schema";
import { clsx, type ClassValue } from "clsx";
import { cache } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function posterURL(poster_path: string | null) {
  return `https://image.tmdb.org/t/p/w500${poster_path}`;
}
export function smallPosterURL(poster_path: string | null) {
  return `https://image.tmdb.org/t/p/w185${poster_path}`;
}
export function backdropURL(backdropImage: string, imageWidth?: string) {
  let url: string = "";

  if (imageWidth) {
    url = `https://image.tmdb.org/t/p/${imageWidth}/${backdropImage}`;
  } else {
    url = `https://image.tmdb.org/t/p/w1280/${backdropImage}`;
  }
  return url;
}
export const ensureArray = (children: React.ReactNode | React.ReactNode[]) => {
  return Array.isArray(children) ? children : [children];
};

export const providerDetails = (slug: string) => {
  let providerId: string = "";
  let providerTitle: string = "";

  switch (slug) {
    case "netflix":
      providerId = "8";
      providerTitle = "Netflix";
      break;
    case "apple-tv-plus":
      providerId = "350";
      providerTitle = "Apple TV+";
      break;
    case "amazon-prime-video":
      providerId = "9";
      providerTitle = "Amazon Prime";
      break;
    case "disney-plus":
      providerId = "337";
      providerTitle = "Disney+";
      break;
    case "hulu":
      providerId = "15";
      providerTitle = "Hulu";
      break;
    default:
      break;
  }
  return { providerId, providerTitle };
};

export const getCardLink = (
  category: "movie" | "tv" | "kids",
  tmdbId: number,
) => {
  let cardLink: string = "";
  switch (category) {
    case "tv":
      cardLink = `/series/${tmdbId}`;
      break;

    case "movie":
      cardLink = `/movies/${tmdbId}`;
      break;

    case "kids":
      cardLink = `/kids/${tmdbId}`;
      break;

    default:
      break;
  }
  return cardLink;
};

// image-utils.ts
export function bufferToDataURL(
  buffer: Uint8Array,
  type = "image/jpeg",
): string {
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${type};base64,${base64}`;
}

export const convertFilms = cache((films: DrizzleFilm[]) => {
  const filmsWithDataUrl = films.map((film) => ({
    ...film,
    backdropImage: bufferToDataURL(film.backdropImage as Uint8Array),
    posterImage: bufferToDataURL(film.posterImage as Uint8Array),
    genres: JSON.parse(film.genres) as string[],
  }));

  return filmsWithDataUrl;
});
