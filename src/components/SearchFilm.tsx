"use client";
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
  }, 1000);

  return (
    <div className="relative rounded flex bg-white h-11 items-center w-full md:w-[250px]">
      <label htmlFor="search" className="sr-only">
        search
      </label>
      <input
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full shadow-xs rounded peer pl-2 text-sm h-full outline-hidden placeholder:text-gray-500 placeholder:text-xs text-black"
        type="search"
        id="search"
        name="search"
        defaultValue={searchParams.get("query")?.toString() || ""}
        required
      />
    </div>
  );
};

export default SearchFilm;
