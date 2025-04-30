"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import clsx from "clsx";
import { useSnapCarousel } from "react-snap-carousel";
import { ensureArray } from "@/lib/utils";
import { useIsInView, usePageVisibility } from "@/hooks";

import { Pagination } from "./Pagination";
import styles from "./Slider.module.css";
import { SliderProps } from "@/types";

const AUTOPLAY_INTERVAL = 9000;

export const Slider: React.FC<SliderProps> = ({
  children,
  itemsGap = "20px",
  autoPlay = false,
  itemScrollSnapStopAlways = false,
  showPagination = false,
  hideOverflowItems = false,
  observerOptions = { threshold: 0.5 },
}) => {
  const firstPageBtnRef = useRef<HTMLButtonElement | null>(null);
  const forwardBtnRef = useRef<HTMLButtonElement | null>(null);
  const allSlidesViewed = useRef(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isInView, observerTargetRef } =
    useIsInView<HTMLDivElement>(observerOptions);
  const isPageVisible = usePageVisibility();
  const { scrollRef, pages, activePageIndex, next, goTo } = useSnapCarousel();

  // Memoized children array to prevent unnecessary re-renders
  const childrenArray = useMemo(() => ensureArray(children), [children]);

  // Optimized autoplay with cleanup and throttling
  const handleAutoPlay = useCallback(() => {
    if (!autoPlay || allSlidesViewed.current || !isPageVisible || !isInView)
      return;

    // Clear existing timer to prevent multiple intervals
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    autoPlayTimerRef.current = setInterval(() => {
      if (activePageIndex === pages.length - 1) {
        next();
        firstPageBtnRef.current?.click();
      } else if (activePageIndex >= 0) {
        next();
        forwardBtnRef.current?.click();
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isPageVisible, isInView, autoPlay, activePageIndex, next, pages.length]);

  useEffect(() => {
    const cleanup = handleAutoPlay();
    return cleanup;
  }, [handleAutoPlay]);

  return (
    <>
      <div
        ref={observerTargetRef}
        className={styles.carouselWrapper}
        style={{ contain: "content" }}
      >
        <ul
          ref={scrollRef}
          style={{ gap: itemsGap }}
          className={styles.carousel}
          tabIndex={-1}
        >
          {childrenArray.map((child, i) => {
            const isInCurrentPage =
              pages.at(activePageIndex)?.includes(i) ?? false;
            return (
              <li
                key={i}
                className={clsx(styles.item, {
                  [styles.fadeItemTransition]: hideOverflowItems,
                  [styles.fadeItem]: hideOverflowItems && !isInCurrentPage,
                  [styles.itemScrollSnapStopAlways]: itemScrollSnapStopAlways,
                })}
                data-visible={isInCurrentPage}
                style={{ willChange: "opacity, transform" }}
              >
                {child}
              </li>
            );
          })}
        </ul>

        {showPagination && (
          <Pagination
            pages={pages}
            activePageIndex={activePageIndex}
            firstPageBtnRef={firstPageBtnRef}
            goTo={goTo}
          />
        )}
      </div>
    </>
  );
};
