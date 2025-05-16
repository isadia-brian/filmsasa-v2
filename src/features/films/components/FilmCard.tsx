import Link from "next/link";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { getCardLink, posterURL } from "@/lib/utils";
import { FilmCardProps } from "@/types/films";

const FilmCard: React.FC<FilmCardProps> = (props) => {
  const { film, section, content } = props;

  const title = film.title;
  const image = film.posterImage;
  const category = film.contentType;
  const tmdbId = film.tmdbId;

  const cardLink = getCardLink(category, tmdbId);

  return (
    <Link
      href={cardLink}
      prefetch={true}
      className={`relative flex flex-col gap-2 rounded-t-(--card-radius) cursor-pointer transition ease-in-out  duration-300 md:hover:-translate-y-5 ${section ? "min-w-[110px] md:min-w-[190px]" : ""} [--card-radius:var(--radius-lg)]`}
    >
      <div
        className={`relative h-[160px] w-full md:h-[280px] rounded-[var(--card-radius)] `}
      >
        <ImageWithSkeleton
          src={
            typeof image === "string" ? posterURL(image) : "/placeholder.webp"
          }
          fill
          sizes="(max-width:768px) 110px, 342px"
          alt={typeof title === "string" ? title : ""}
          className="object-cover rounded-[var(--card-radius)] object-center"
          loading="lazy"
          decoding="sync"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col space-y-1.5">
          <div className="font-medium text-white text-[13px] line-clamp-1 md:max-w-44">
            {title}
          </div>
          {section && (
            <div>
              <div className="text-gray-400 text-xs capitalize">{category}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FilmCard;
