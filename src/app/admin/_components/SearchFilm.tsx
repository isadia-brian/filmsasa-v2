"use client";
import { SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchFilm = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex mb-2 items-center  border-stone-300">
      <label htmlFor="search" className="sr-only">
        search
      </label>
      <input
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-md outline-hidden shadow-xs peer block pl-2 text-red-600 text-sm py-[9px] placeholder:text-red-500/40"
        type="search"
        id="search"
        name="search"
        defaultValue={searchParams.get("query")?.toString() || ""}
        required
      />
      <SearchIcon className="absolute right-1 top-0 h-full w-5 text-gray-400" />
    </div>
  );
};

export default SearchFilm;
