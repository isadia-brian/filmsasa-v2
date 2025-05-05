import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

const RecommendedCard = (props: {
  title: string;
  name: string;
  id: number;
  backdrop_path: string;
  media: string;
}) => {
  const { title, name, id, backdrop_path, media } = props;

  let url: string = "";

  switch (media) {
    case "movie":
      url = `/movies/${id}`;

      break;

    case "tv":
      url = `/series/${id}`;

      break;

    case "kids":
      url = `/kids/${id}`;

      break;

    default:
      break;
  }
  return (
    <li className="flex flex-col space-y-2" key={id}>
      <Link
        href={url}
        className="group relative h-[110px] w-[200px] md:h-[150px] md:w-[260px] rounded-lg bg-white hover:cursor-default"
      >
        <Image
          src={
            typeof backdrop_path === "string"
              ? `https://image.tmdb.org/t/p/w300${backdrop_path}`
              : `/placeholder.webp`
          }
          fill
          alt={title || name}
          className="rounded-lg object-cover"
          loading="lazy"
        />
        <div className="absolute opacity-0 lg:group-hover:opacity-100 transition-opacity w-full h-full left-0 bg-linear-to-t from-black/70 via-black/50 rounded-lg">
          <div className=" h-full flex items-center justify-center">
            <div className="flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 px-7  rounded-full cursor-pointer font-semibold text-black py-2">
              <span>
                <PlayCircle />
              </span>
              WATCH
            </div>
          </div>
        </div>
      </Link>
      <p className="text-xs lg:text-sm font-semibold  min-h-10">
        {title || name}
      </p>
    </li>
  );
};

export default RecommendedCard;
