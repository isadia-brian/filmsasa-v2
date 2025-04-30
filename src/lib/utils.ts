import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function posterURL(poster_path: string | null) {
  return `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`;
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
