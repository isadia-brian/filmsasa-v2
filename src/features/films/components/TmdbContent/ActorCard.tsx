"use client";

import Image from "next/image";

interface ActorCardProps {
  actor: {
    profile_path: string | null;
    name: string;
    character?: string;
  };
}

const ActorCard = ({ actor }: ActorCardProps) => {
  const { profile_path, name, character } = actor;

  const fullname = name?.split(" ");
  const characterName = character?.split(" ") ?? [];

  const displayName =
    fullname?.length > 2 ? fullname.slice(0, 2).join(" ") : fullname?.join(" ");

  const displayCharacter =
    characterName.length > 2
      ? characterName.slice(0, 1).join(" ")
      : characterName.join(" ");

  const imageBaseUrl = "https://image.tmdb.org/t/p/w185";
  const imageUrl = profile_path ? `${imageBaseUrl}${profile_path}` : null;

  return (
    <div className="flex flex-col py-1 max-w-[6rem] md:max-w-[7.5rem] px-1 items-center">
      <div className="relative h-[5.9rem] w-[5.9rem] lg:h-[6.5rem] lg:w-[6.5rem] rounded-full ring-1 ring-offset-1 ring-white">
        {imageUrl && (
          <Image
            src={imageUrl}
            fill
            alt={`${name || "Actor"} Profile`}
            className="rounded-full object-cover"
            loading="lazy"
            quality={65}
          />
        )}
      </div>
      <div className="h-16 mt-3 mb-1">
        <p className="flex items-center text-center justify-center text-xs lg:text-sm font-semibold">
          {displayName}
        </p>
      </div>
      <div className="h-16">
        <p className="flex text-center items-center justify-center text-xs lg:text-sm font-light">
          {displayCharacter}
        </p>
      </div>
    </div>
  );
};

export default ActorCard;
