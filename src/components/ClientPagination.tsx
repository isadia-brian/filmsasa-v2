"use client";

import { useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

export const ClientPagination = React.memo(
  ({
    totalItems,
    itemsPerPage,
    currentPage,
  }: {
    totalItems: any;
    itemsPerPage: any;
    currentPage: any;
  }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const pagesCount = Math.ceil(totalItems / itemsPerPage);
    if (pagesCount === 1) return null;

    const visiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(pagesCount, startPage + visiblePages - 1);

    // Adjust startPage if near the end
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const createPageURL = (pageNumber: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    };

    const nextPageUrl = () => {
      let url: string = "";

      const params = new URLSearchParams(searchParams);
      if (currentPage < pagesCount) {
        let pageNumber = currentPage;
        pageNumber++;
        params.set("page", pageNumber.toString());
        url = `${pathname}?${params.toString()}`;
      } else {
        params.set("page", currentPage.toString());
        url = `${pathname}?${params.toString()}`;
      }
      return url;
    };

    const prevPageUrl = () => {
      let url: string = "";

      const params = new URLSearchParams(searchParams);
      if (currentPage > 1) {
        let pageNumber = currentPage;
        pageNumber--;
        params.set("page", pageNumber.toString());
        url = `${pathname}?${params.toString()}`;
      } else {
        params.set("page", currentPage.toString());
        url = `${pathname}?${params.toString()}`;
      }
      return url;
    };
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={prevPageUrl()}
              scroll={false}
              onClick={() => {
                // Manually scroll after navigation
                setTimeout(() => {
                  document.getElementById("top")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100); // Short delay to ensure navigation completes
              }}
            />
          </PaginationItem>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((page) => (
            <PaginationItem
              key={page}
              className={
                currentPage === page
                  ? "bg-neutral-100 text-black rounded-md"
                  : ""
              }
            >
              <PaginationLink
                href={createPageURL(page)}
                scroll={false}
                onClick={() => {
                  // Manually scroll after navigation
                  setTimeout(() => {
                    document.getElementById("top")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }, 100); // Short delay to ensure navigation completes
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={nextPageUrl()}
              scroll={false}
              onClick={() => {
                // Manually scroll after navigation
                setTimeout(() => {
                  document.getElementById("top")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100); // Short delay to ensure navigation completes
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
);
