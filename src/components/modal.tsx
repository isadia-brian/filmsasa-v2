"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const triggerModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div>
      <Button onClick={triggerModal}>Open Modal</Button>
      {isOpen && (
        <div className="fixed inset-0 z-2000 bg-black/80 no-scrollbar w-full overflow-y-auto">
          <div className="fixed left-[50%] top-[50%] bg-white z-2000 w-full h-full max-h-[90vh]  max-w-[1200px] px-2 py-4  translate-x-[-50%]  -translate-y-[50%]  rounded-md">
            <div className="w-full flex items-end justify-end mb-4">
              <Button
                size={"icon"}
                className="bg-red-500/70 rounded-full flex items-center justify-center cursor-pointer"
                onClick={triggerModal}
              >
                <X className="text-white" size={48} />
              </Button>
            </div>
            <div className="max-h-[80vh] overflow-y-scroll no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
