// Hero types

export interface SliderProps {
  children: React.ReactNode | React.ReactNode[];
  itemsGap?: string;
  autoPlay?: boolean;
  itemScrollSnapStopAlways?: boolean;
  showPagination?: boolean;
  btnHoverVariant?: "shadowHover" | "scaleHover";
  hideOverflowItems?: boolean;
  observerOptions?: IntersectionObserverInit;
}

export interface PaginationProps {
  pages: number[][];
  activePageIndex: number;
  firstPageBtnRef: React.RefObject<HTMLButtonElement | null>;
  goTo: (pageIndex: number) => void;
}

export interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

// User types

export type UserRole = "user" | "admin";
export type User = {
  id: number;
  email: string | null;
  role: UserRole;
  username: string;
} | null;

export interface HeroProptype {
  film: {
    title: string;
    backdropImage: string;
    posterImage: string;
    genres: string[];
    mediaType: "movie" | "tv";
    tmdbId: number;
    contentType: string;
    overview: string;
    seasons: number | null;
    runtime: string | null;
    tmdbPosterUrl: string;
  };
  userId?: number;
  priorityLoad?: boolean;
}
