import Image from "next/image";

const ActorCard = (props: {
  actor: { profile_path: string };
  name: string;
}) => {
  const { actor, name } = props;
  const returnedImage = actor.profile_path;

  const imageBaseUrl = `https://image.tmdb.org/t/p/w185`;
  let ImageUrl: string | null = null;

  if (returnedImage !== null && returnedImage !== undefined) {
    ImageUrl = imageBaseUrl.concat(returnedImage);
  }

  return (
    <li className="flex flex-col space-y-2 py-1 px-1 items-center">
      <div className="relative h-[5.9rem] w-[5.9rem] lg:h-[6.5rem] lg:w-[6.5rem] rounded-full ring-2 ring-offset-1 ring-white">
        {ImageUrl && (
          <Image
            src={ImageUrl}
            fill
            alt={name}
            className="rounded-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <p className="flex items-center justify-center text-xs lg:text-sm font-semibold  min-h-10 text-center">
        {name}
      </p>
    </li>
  );
};

export default ActorCard;
