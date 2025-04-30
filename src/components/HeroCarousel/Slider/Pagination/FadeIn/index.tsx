import clsx from "clsx";
import styles from "./FadeIn.module.css";

import { FadeInProps } from "@/types";

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 300,
  delay = 0,
  className,
}) => {
  return (
    <div
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
      }}
      className={clsx(styles.fadeIn, className)}
    >
      {children}
    </div>
  );
};
