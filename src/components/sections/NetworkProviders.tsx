import Image from "next/image";
import Link from "next/link";

const watchProviders = [
  {
    name: "Netflix",
    logo: `/providers/netflix.svg`,
    link: "/providers/netflix",
  },
  {
    name: "Apple TV",
    logo: `/providers/apple-tv.svg`,
    link: "/providers/apple-tv-plus",
  },
  {
    name: "Amazon Prime",
    logo: `/providers/prime-video.svg`,
    link: "/providers/amazon-prime-video",
  },
  {
    name: "Disney+",
    logo: `/providers/disney-plus.svg`,
    link: "/providers/disney-plus",
  },
  {
    name: "Hulu",
    logo: `/providers/hulu.svg`,
    link: "/providers/hulu",
  },
];

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
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              className="object-cover rounded-md"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NetworkProviders;
