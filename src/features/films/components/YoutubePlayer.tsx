const YoutubePlayer = (props: {
  officialTrailer: string | undefined;
  toggleYoutube: () => void;
  title: string | undefined;
}) => {
  const { officialTrailer, toggleYoutube, title } = props;

  return (
    <div className="fixed inset-0 flex flex-col gap-8 py-12 md:py-0 md:justify-center items-center backdrop-blur-md z-700">
      <div
        className="transition duration-150 ease-in-out h-[50px] w-[50px] bg-neutral-900/80 rounded-full text-white flex items-center justify-center cursor-pointer hover:bg-white hover:text-black"
        onClick={toggleYoutube}
      >
        <p className="font-extrabold text-xl">X</p>
      </div>

      <div className="flex items-center justify-center bg-black w-full h-[40vh] md:h-[70vh] md:w-[90vw] mx-4">
        <iframe
          id="ytplayer"
          width="100%"
          height="100%"
          loading="lazy"
          title={title}
          src={`${officialTrailer}?loop=1&autoplay=1`}
        ></iframe>
      </div>
    </div>
  );
};

export default YoutubePlayer;
