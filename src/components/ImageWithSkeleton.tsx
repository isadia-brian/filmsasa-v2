"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

const ImageWithSkeleton: React.FC<ImageProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse rounded h-full w-full" />
      )}
      <Image
        {...props}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.webp";
        }}
      />
    </>
  );
};

export default ImageWithSkeleton;
