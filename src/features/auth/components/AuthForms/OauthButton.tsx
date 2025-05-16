import Image from "next/image";

const OauthButton = () => {
  return (
    <div className="w-fit mx-auto">
      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-[#232526] to-[#2d2e30] rounded-full px-5 py-3 font-medium text-white shadow hover:brightness-110 transition mb-2 text-sm">
        <div className="relative h-5 w-5">
          <Image src="/google.svg" alt="Google" fill className="object-cover" />
        </div>
        Continue with Google
      </button>
    </div>
  );
};

export default OauthButton;
