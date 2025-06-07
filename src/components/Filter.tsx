//import { fetchFilmGenres } from "@/features/tmdb/server/actions/films";
//import DropDown from "./DropDown";
import SearchFilm from "./SearchFilm";

const Filter = async ({ filmType }: { filmType: string }) => {
  let mediaType: "movie" | "tv" = "movie";

  if (filmType === "series") {
    mediaType = "tv";
  }
  //const genres = await fetchFilmGenres(mediaType);

  // const sortByList = [
  //   {
  //     name: "Popular",
  //     value: "popular",
  //   },
  //   {
  //     name: "Top Rated",
  //     value: "top_rated",
  //   },
  // ];

  return (
    <div>
      <div className="md:hidden my-6">
        <SearchFilm placeholder={`Search ${filmType}`} />
      </div>
      <div className="flex gap-7 w-full mb-5 text-neutral-600">
        <div className="hidden md:inline-block">
          <SearchFilm placeholder={`Search ${filmType}`} />
        </div>
        {/*<DropDown label="Sort">
          <ul className="flex flex-col gap-2 pl-1">
            {sortByList?.map((item) => (
              <li
                key={item?.name}
                className="text-sm py-2 text-neutral-800 hover:bg-neutral-300 px-2 rounded-md"
                role="button"
              >
                {item.name}
              </li>
            ))}
          </ul>
        </DropDown>
        <DropDown label="Year">
          <ul className="grid grid-cols-13 gap-2 pl-3">
            {years?.map((year, index) => (
              <li
                key={index}
                className="text-sm py-2 text-neutral-800 max-w-fit hover:bg-stone-100 px-2 rounded-md"
                role="button"
              >
                {year}
              </li>
            ))}
          </ul>
        </DropDown>
        <DropDown label="Genre">
          <ul className="grid grid-cols-4 gap-2 pl-4">
            {genres?.map((genre: string, index: number) => (
              <li
                key={index}
                className="text-sm line-clamp-1 text-neutral-800 py-2 max-w-fit hover:bg-stone-100 px-2 rounded-md"
                role="button"
              >
                {genre}
              </li>
            ))}
          </ul>
        </DropDown>*/}
      </div>
    </div>
  );
};

export default Filter;
