"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const VideoPlayer = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("id");
  const media = searchParams.get("media");

  return (
    <div className="relative min-h-screen px-4 w-full flex justify-center items-center  md:py-24 bg-black/90">
      <div className="w-full mx-auto  h-[30vh] md:h-[85vh]">
        <iframe
          className="w-full rounded-md h-full "
          allowFullScreen
          loading="lazy"
          src={`https://vidsrc.xyz/embed/${media}/${videoId}?autoplay=1&muted=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  );
};

// Main Watch component with Suspense boundary
const Watch = () => {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen px-4 w-full flex justify-center items-center md:py-24 bg-black/90">
          <p className="text-white">Loading...</p>
        </div>
      }
    >
      <VideoPlayer />
    </Suspense>
  );
};

export default Watch;
