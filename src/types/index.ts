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
