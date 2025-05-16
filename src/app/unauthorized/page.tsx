import Link from "next/link";

const page = () => {
  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="h-full w-full flex flex-col space-y-3 md:space-y-5 items-center justify-center text-slate-100">
        <p className="text-7xl lg:text-[10rem] font-black tracking-widest text-slate-200">
          4<span className="text-red-600">0</span>4
        </p>
        <p className="uppercase font-bold text-4xl">unauthorized</p>
        <div className="flex flex-col items-center justify-center gap-4">
          <p>Access denied due to invalid credentials</p>
          <Link
            href={"/"}
            className="border-[0.8px] border-slate-300 uppercase cursor-pointer text-sm px-4 py-2.5 md:px-6 md:font-medium"
          >
            take me home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
