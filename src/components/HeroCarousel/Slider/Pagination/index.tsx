import clsx from "clsx";
import { useHasMounted } from "@/hooks";
import { FadeIn } from "./FadeIn";
import styles from "./Pagination.module.css";

import { PaginationProps } from "@/types";

export const Pagination: React.FC<PaginationProps> = ({
  pages,
  activePageIndex,
  firstPageBtnRef,
  goTo,
}) => {
  const isMounted = useHasMounted();

  return (
    <div className={styles.paginationWrapper}>
      {isMounted && (
        <FadeIn className={styles.pagination}>
          {pages.map((_, i) => (
            <button
              key={i}
              ref={i === 0 ? firstPageBtnRef : null}
              aria-label={`Show slide ${i + 1} of ${pages.length}`}
              className={clsx(
                styles.paginationBtn,
                activePageIndex === i && styles.paginationBtnActive,
              )}
              onClick={() => goTo(i)}
            ></button>
          ))}
        </FadeIn>
      )}
    </div>
  );
};
