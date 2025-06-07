import { clsx, type ClassValue } from "clsx";
import { cache, RefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function posterURL(poster_path: string | null) {
  return `https://image.tmdb.org/t/p/w342${poster_path}`;
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

export const providerDetails = cache((slug: string) => {
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
});

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

export const scrollContainer = (
  direction: number = 0,
  scrollContainerRef?: RefObject<HTMLDivElement | null>,
) => {
  if (scrollContainerRef?.current) {
    if (direction === 0) {
      // Reset scroll position to the start (when changing filter)
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll left or right when clicking on arrows
      scrollContainerRef.current.scrollBy({
        left: direction * 300, // Adjust this value as needed for scrolling distance
        behavior: "smooth",
      });
    }
  }
};
