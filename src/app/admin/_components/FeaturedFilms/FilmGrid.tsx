import Image from "next/image";
import DeleteBtn from "./DeleteBtn";

type Props = {
  category: string;
  films: {
    title: string;
    posterImage: string;
    tmdbId: number;
  }[];
};

const FilmGrid = (props: Props) => {
  const { films, category } = props;
  return (
    <div>
      <ul className="grid md:grid-cols-6 gap-2 relative">
        {films?.map((film, index) => (
          <li
            key={index}
            className="relative flex flex-col items-start gap-0.5"
          >
            <div className=" h-[260px] w-full relative rounded">
              <Image
                src={film.posterImage || "/placeholder.webp"}
                fill
                placeholder="blur"
                blurDataURL={film.posterImage}
                className="object-cover rounded"
                alt={film.title}
              />
              <DeleteBtn tmdbId={film.tmdbId} category={category} />
            </div>
            <p className="text-sm font-medium line-clamp-1">{film.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilmGrid;
