import localFont from "next/font/local";

import { DM_Sans } from "next/font/google";

export const dmsans = DM_Sans({
  weight: "900",
  subsets: ["latin"],
});

export const poppins = localFont({
  src: [
    {
      path: "../fonts/poppins/Poppins-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});

export const spacemono = localFont({
  src: [
    {
      path: "../fonts/spacemono/SpaceMonoNerdFont-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/spacemono/SpaceMonoNerdFont-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

export const mangrotesque = localFont({
  src: [
    {
      path: "../fonts/mangogrotesque/MangoGrotesque-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/mangogrotesque/MangoGrotesque-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const satoshi = localFont({
  src: [
    {
      path: "../fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export const aquire = localFont({
  src: [
    {
      path: "../fonts/aquire/AquireBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});
