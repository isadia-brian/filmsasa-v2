"use client";

import { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

const AuthForms = ({ toggleAuth }: { toggleAuth: () => void }) => {
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  return (
    <div className=" bg-white w-[420px] text-neutral-950 px-6 py-6 rounded-lg border-[1px] border-r-slate-100 shadow shadow-slate-200">
      {!toggleForm ? (
        <div>
          <SignInForm
            setToggleForm={() => setToggleForm(!toggleForm)}
            toggleAuth={toggleAuth}
          />
        </div>
      ) : (
        <div>
          <SignUpForm
            setToggleForm={() => setToggleForm(!toggleForm)}
            toggleAuth={toggleAuth}
          />
        </div>
      )}
    </div>
  );
};

export default AuthForms;
