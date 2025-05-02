"use client";
import { Button } from "@/components/ui/button";
import { seedFilms } from "@/features/films/server/db/SeedFilms";

const SeedButton = ({ contentType }: { contentType: string }) => {
  const handleClick = async () => {
    switch (contentType) {
      case "movies":
        await seedFilms("movie");
        break;
      case "tv":
        await seedFilms("tv");
        break;
      case "kids":
        await seedFilms("kids");
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant={"outline"}
        onClick={handleClick}
        className="w-[140px] py-4.5 cursor-pointer"
      >
        Seed <span className="capitalize">{contentType}</span>
      </Button>
    </div>
  );
};

export default SeedButton;
