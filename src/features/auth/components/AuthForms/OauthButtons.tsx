import Image from "next/image";
import img1 from "../../../../../public/google.svg";
import img2 from "../../../../../public/facebook.svg";
import img3 from "../../../../../public/apple.svg";

const buttons = [
  {
    img: img1,
  },
  {
    img: img2,
  },
  {
    img: img3,
  },
];

const OauthButtons = () => {
  return (
    <div className="w-[150px] mx-auto flex justify-between">
      {buttons.map((btn, index) => (
        <button
          type="submit"
          className="border border-slate-200 cursor-pointer rounded-md h-10 w-10 flex items-center justify-center shadow"
          key={index}
        >
          <Image
            width={20}
            height={20}
            className="object-cover"
            src={btn.img}
            alt="g"
          />
        </button>
      ))}
    </div>
  );
};

export default OauthButtons;
