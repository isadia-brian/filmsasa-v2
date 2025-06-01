"use client";

import Image from "next/image";

const ActorCard = (props: {
  actor: { profile_path: string; name: string; character: string };
}) => {
  const { actor } = props;
  const { profile_path, name, character } = actor;
  const returnedImage = profile_path;
  const fullname = name?.split(" ");
  const characterName = character?.split(" ");

  const twoNames =
    fullname?.length > 2 ? fullname.slice(0, 2).join(" ") : fullname.join(" ");

  const oneCharacterName =
    characterName?.length > 2
      ? characterName.slice(0, 1).join(" ")
      : characterName.join(" ");

  const imageBaseUrl = `https://image.tmdb.org/t/p/w185`;
  let ImageUrl: string | null = null;

  if (returnedImage !== null && returnedImage !== undefined) {
    ImageUrl = imageBaseUrl.concat(returnedImage);
  }

  return (
    <div className="flex flex-col py-1 max-w-[6rem] md:max-w-[7.5rem] px-1 items-center">
      <div className="relative h-[5.9rem] w-[5.9rem] lg:h-[6.5rem] lg:w-[6.5rem] mb-3 rounded-full ring-1 ring-offset-1 ring-white">
        {ImageUrl && (
          <Image
            src={ImageUrl}
            fill
            alt={name}
            className="rounded-full object-cover"
            loading="lazy"
            quality={65}
          />
        )}
      </div>
      <div className="min-h-10 mb-3">
        <p className="flex items-center justify-center text-xs lg:text-sm font-semibold text-center ">
          {twoNames}
        </p>
      </div>

      <p className="flex items-center justify-center text-xs lg:text-sm font-light text-center">
        {oneCharacterName}
      </p>
    </div>
  );
};

export default ActorCard;
