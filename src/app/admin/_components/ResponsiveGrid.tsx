"use client";

import useWindowSize from "@/hooks/useWindowSize";

const ResponsiveGrid = () => {
  const windowSize = useWindowSize();

  return <div>{windowSize.width}</div>;
};

export default ResponsiveGrid;
