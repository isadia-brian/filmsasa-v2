import Image from "next/image";

const SiteLogo = () => {
  return (
    <div className="relative flex items-center gap-2 py-4">
      <div className="relative h-10 w-10">
        <Image src={"/logo.webp"} fill alt="logo" className="object-cover" />
      </div>
    </div>
  );
};

export default SiteLogo;
