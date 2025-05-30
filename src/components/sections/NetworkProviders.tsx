import Link from "next/link";
import ImageWithSkeleton from "../ImageWithSkeleton";
import { watchProviders } from "@/data/links";

const NetworkProviders = () => {
  return (
    <div className="relative mb-5 mt-5 md:my-8">
      <div className="flex items-center pb-5 justify-between gap-2 md:gap-0 border-b-[0.5px] border-white/20 mb-0">
        <h1 className="md:text-[20px] leading-none font-bold text-orange-500 px-4">
          Networks
        </h1>
      </div>
      <div className="py-5 flex md:grid md:grid-cols-5 gap-3 px-4 w-full overflow-x-scroll no-scrollbar">
        {watchProviders.map((provider) => (
          <Link
            key={provider.name}
            href={provider.link}
            prefetch={false}
            className="flex min-w-[170px] h-[120px] items-center cursor-pointer justify-center relative bg-white rounded-md"
          >
            <ImageWithSkeleton
              src={provider.logo}
              alt={provider.name}
              fill
              className="object-cover rounded-md"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NetworkProviders;
