"use client";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface ListObjectProps {
  name: string;
  value: string;
}

type DropDownProps = {
  label: string;
  children: React.ReactNode;
};

const DropDown = ({ label, children }: DropDownProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  return (
    <div className="transition-colors relative text-slate-100 hover:bg-white hover:text-stone-950 cursor-pointer hover:rounded">
      <div className="flex items-center h-full justify-center">
        <button
          className="flex items-center gap-6 h-8 md:h-full justify-between px-2 text-xs"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {label}
          <span>
            <ChevronDown size={16} color="#fff" />
          </span>
        </button>
        {isHovered && (
          <div
            className={`absolute py-4 px-2 top-10 md:top-[50px] border-gray-200 left-0 bg-white shadow-md z-10 rounded ${label === "Genre" ? "w-[720px]" : label === "Year" ? "w-[760px]" : "w-[150px]"}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDown;
