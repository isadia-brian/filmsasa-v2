"use client";

import { useEffect, useState } from "react";
import { TabGroup } from "@/components/TabGroup";
import dynamic from "next/dynamic";

const SignUpForm = dynamic(() => import("../AuthForms/SignUp"), { ssr: false });
const SignInForm = dynamic(() => import("../AuthForms/SignIn"), { ssr: false });

type AuthModalProps = {
  toggleAuth: () => void;
};

const AuthModal = ({ toggleAuth }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("signIn");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div>
      <div className="fixed inset-0 z-2000 bg-black/90 backdrop-blur-md no-scrollbar w-full overflow-y-auto flex items-center justify-center">
        <div className="px-2 py-2 w-fit ">
          <div className="w-[500px] space-y-1.5">
            <TabGroup activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "signIn" ? (
              <SignInForm toggleAuth={toggleAuth} />
            ) : (
              <SignUpForm toggleAuth={toggleAuth} setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
