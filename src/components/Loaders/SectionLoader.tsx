import FilmCardLoader from "./FilmCardLoader";

const SectionLoader = () => {
  return (
    <div>
      <div className="relative border-b-[0.5px] border-white/20">
        <div className="flex gap-5 md:gap-0 justify-between px-4 md:px-6 h-[80px] md:py-4 md:h-[50px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-20 h-5 bg-slate-400 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      <div className="w-full hidden md:flex justify-end items-center pr-4 pt-3 md:pr-6">
        <div className="flex items-center gap-1">
          <div className="h-5 w-5 bg-slate-400 animate-pulse rounded-full" />
          <div className="h-5 w-5 bg-slate-400 animate-pulse rounded-full" />
        </div>
      </div>
      <div className="relative lg:min-h-[360px] flex gap-[10px] px-4 pt-5 w-full  overflow-x-scroll no-scrollbar">
        {Array.from({ length: 7 }).map((_, index) => (
          <FilmCardLoader key={index} section={true} />
        ))}
      </div>
    </div>
  );
};

export default SectionLoader;
