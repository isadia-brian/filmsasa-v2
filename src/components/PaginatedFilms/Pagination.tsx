"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

const Pagination = ({
  totalCount,
  pageSize,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pagesCount = Math.ceil(totalCount / pageSize);

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 px-4">
      {pages.map((page) => (
        <li
          key={page}
          className={
            page === currentPage
              ? "text-black bg-slate-100 gradient font-semibold h-8 w-8 rounded-md flex items-center justify-center"
              : "text-slate-300"
          }
        >
          <Link
            href={createPageURL(page)}
            className="cursor-pointer"
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
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
