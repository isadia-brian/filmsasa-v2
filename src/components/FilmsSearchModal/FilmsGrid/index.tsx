import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { smallPosterURL } from "@/lib/utils";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface FilmsGridType {
  contentType?: string;
  data: {
    id: number;
    poster_path?: string;
    title?: string;
    name?: string;
    profile_path?: string;
  }[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const FilmsGrid = ({ contentType, data, setIsOpen }: FilmsGridType) => {
  return (
    <div className="h-full flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <p className="capitalize">{contentType ? contentType : "People"}</p>
        {data?.length > 0 && (
          <p className="text-xs text-neutral-400">{data.length} results</p>
        )}
      </div>
      <div
        className="overflow-x-auto remove-scrollbar md:overflow-y-auto md:max-h-[550px] [&::-webkit-scrollbar]:w-[4px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-red-500
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <ul className="flex md:flex-col gap-2">
          {data?.map(
            (
              item: {
                id: number;
                poster_path?: string;
                profile_path?: string;
                title?: string;
                name?: string;
              },
              i: number,
            ) => (
              <li key={item.id}>
                <Link
                  href={
                    typeof contentType === "string"
                      ? `/${contentType}/${item.id}`
                      : "#"
                  }
                  className="flex flex-col md:flex-row items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-[100px] w-[100px] relative border-[1px] border-slate-50/45">
                    <ImageWithSkeleton
                      src={
                        typeof item.poster_path === "string"
                          ? smallPosterURL(item.poster_path)
                          : typeof item.profile_path === "string"
                            ? smallPosterURL(item.profile_path)
                            : "/placeholder.webp"
                      }
                      fill
                      alt={
                        typeof item.title === "string"
                          ? item.title
                          : typeof item.name === "string"
                            ? item.name
                            : ""
                      }
                      className="object-center object-cover"
                      priority={i < 6 ? true : false}
                    />
                  </div>
                  <p className="text-xs font-medium md:font-semibold max-w-[100px] md:max-w-[200px] line-clamp-3">
                    {item.title || item.name}
                  </p>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};

export default FilmsGrid;
