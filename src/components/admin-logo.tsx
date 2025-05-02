import Image from "next/image";

const AdminLogo = () => {
  return (
    <div className="relative flex items-center gap-2 py-4">
      <div className="relative h-6 w-6">
        <Image src={"/logo.webp"} fill alt="logo" className="object-cover" />
      </div>
      <p className="truncate font-medium text-sm">Filmsasa</p>
    </div>
  );
};

export default AdminLogo;
