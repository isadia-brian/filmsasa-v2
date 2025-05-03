import Link from "next/link";
import { posterURL } from "@/lib/utils";
import Image from "next/image";

const AdminPaginatedFilms = ({
  allFilms,
  totalCount,
  currentPage,
  pageSize,
}: {
  allFilms: any[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
}) => {
  return (
    <ul className="grid md:grid-cols-6 gap-2 relative">
      {allFilms?.map((film, index) => (
        <li key={index} className="relative flex flex-col items-start gap-0.5">
          <div className=" h-[260px] w-full relative rounded">
            <Image
              src={posterURL(film.posterImage)}
              fill
              className="object-cover rounded"
              alt={film.title}
            />
          </div>
          <p className="text-sm font-medium line-clamp-1">{film.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default AdminPaginatedFilms;
