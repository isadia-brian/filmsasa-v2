"use client";

import { scrollContainer } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { RefObject } from "react";

export const ScrollButtons = ({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  const pathname = usePathname();
  return (
    <div
      className={`w-full hidden md:flex justify-end items-center pr-4 md:pr-6 ${pathname === "/" ? "pt-3" : ""}`}
    >
      <div className="flex items-center gap-[1px]">
        <ChevronLeft
          onClick={() => scrollContainer(-1, scrollContainerRef)}
          className="h-5 w-5 text-white/65 hover:text-white transition-colors duration-300 cursor-pointer"
        />
        <ChevronRight
          onClick={() => scrollContainer(1, scrollContainerRef)}
          className="h-5 w-5 text-white/65 hover:text-white transition-colors duration-300 cursor-pointer"
        />
      </div>
    </div>
  );
};
