const FilmPagesLoader = () => {
  return (
    <div className=" w-full min-h-[70vh] relative">
      <ul className="pt-4 md:pt-6 pb-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-x-[10px] md:gap-x-[16px] gap-y-10 lg:gap-x-[10px] md:mb-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <li
            key={index}
            className=" min-w-[100px] flex flex-col gap-2 lg:col-span-2 "
          >
            <div className="relative h-[160px]  md:h-[240px] animate-pulse bg-neutral-700 lg:h-[280px] rounded-md" />
            <div className="animate-pulse bg-slate-400 h-4 w-10 rounded-md " />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilmPagesLoader;
