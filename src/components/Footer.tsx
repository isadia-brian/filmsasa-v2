import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { mangrotesque } from "@/app/fonts";
import { Links } from "@/data/links";

const Footer = async () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`relative text-white pt-10 pb-2 bg-neutral-800 h-full `}>
      <div className="h-full mx-auto lg:max-w-[2000px] w-full">
        <div className="px-4 h-full w-full">
          <div className="pt-[40px] md:pt-8">
            <div className="flex flex-col items-start md:flex-row md:items-end justify-between mb-[30px] md:mb-[70px]">
              <div
                className={`max-w-[300px] mb-6 md:mb-0 lg:max-w-[600px] ${mangrotesque.className}`}
              >
                <h3 className="text-[100px] md:text-[120px] lg:text-9xl font-medium uppercase leading-[85.5%]">
                  <span>Enjoy The Latest</span>
                  <br />
                  <span>Film Online.</span>
                </h3>
              </div>
              <div className="flex-none mb-0 ml-0 md:ml-[30px] md:mb-5 lg:ml-[50px]">
                <div className="mb-[32px] max-w-[300px] md:mb-[35px] md:max-w-[265px]">
                  <p className="leading-5 max-w-[165px] md:max-w-none">
                    Access an extensive library of movies and tv shows
                  </p>
                </div>
                <div>
                  <Link
                    href={"/"}
                    className={`inline-flex items-center  space-x-2 md:justify-between h-[50px] md:h-[64px] px-5 font-bold text-black uppercase bg-white`}
                  >
                    <p
                      className={`${mangrotesque.className} text-[24px] md:text-[36px]`}
                    >
                      Start a conversation
                    </p>
                    <p>
                      <ArrowRight strokeWidth={2.8} className="mb-1 md:mb-2" />
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <ul className="flex items-center mb-[30px] md:mb-[70px] gap-8 md:gap-[90px] lg:gap-[100px] flex-wrap justify-start md:justify-center">
              {Links.map((link, idx) => (
                <li
                  key={idx}
                  className="transition duration-300 ease-linear hover:underline underline-offset-2 "
                >
                  <Link
                    href={link.url}
                    prefetch={false}
                    className="flex items-center"
                  >
                    <p> {link.name}</p>
                    <ArrowUpRight className="h-4" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-3 text-sm pt-2 border-t-[0.5px] border-white">
              <p>© {currentYear} Filmsasa</p>
              <div className="h-[3px] w-[3px] rounded-full bg-white" />
              <p>Developed by Isadia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
