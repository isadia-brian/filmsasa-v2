import Prewatch from "@/components/Prewatch";

const page = async ({ params }: { params: Promise<{ tmdbId: string }> }) => {
  const { tmdbId } = await params;
  const filmId = parseInt(tmdbId);
  const media_type = "movie";

  return (
    <div className="w-full text-slate-200 relative">
      <Prewatch kidsPage={true} mediaType={media_type} tmdbId={filmId} />
    </div>
  );
};

export default page;
