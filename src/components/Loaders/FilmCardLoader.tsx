const FilmCardLoader = ({ section }: { section?: boolean }) => {
  return (
    <div
      className={`relative  flex flex-col gap-2 rounded-t-(--card-radius) ${section ? "min-w-[110px] md:min-w-[190px]" : ""} [--card-radius:var(--radius-lg)]`}
    >
      <div
        className={`relative animate-pulse bg-slate-400 h-[160px] w-full md:h-[280px] rounded-[var(--card-radius)] `}
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col space-y-1.5">
          <div className="line-clamp-1 md:w-12 animate-pulse bg-slate-400 h-3 rounded-lg" />
          {section && (
            <div>
              <div className="bg-slate-400 h-2.5 md:w-10 animate-pulse rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmCardLoader;
