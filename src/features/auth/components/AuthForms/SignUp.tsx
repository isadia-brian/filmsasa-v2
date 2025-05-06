"use client";

import { useActionState } from "react";
import { modalSignUp } from "@/features/auth/server/actions";
import { XCircleIcon } from "lucide-react";
import OauthButtons from "./OauthButtons";

type FormActions = {
  setToggleForm: () => void;
  toggleAuth: () => void;
};

const SignUpForm = ({ setToggleForm, toggleAuth }: FormActions) => {
  const [state, action, pending] = useActionState(modalSignUp, undefined);
  if (state?.success === true) {
    const handleSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setToggleForm();
    };
    handleSuccess();
  }
  return (
    <div className="space-y-10 w-full">
      <div className="flex flex-col space-y-4.5">
        <div className="flex flex-col space-y-1 ">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-2xl">Sign up</h5>
            <button
              type="button"
              className="cursor-pointer"
              onClick={toggleAuth}
            >
              <XCircleIcon className="text-neutral-500" />
            </button>
          </div>
          <p className="text-sm text-neutral-600">
            Enter your details below to sign up
          </p>
          {state?.success === true && (
            <p className="text-xs text-green-500">{state.message}</p>
          )}
        </div>
        <form action={action} className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1 w-full">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="firstName"
                  className="text-xs text-neutral-600 font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="ex:John"
                  className="text-black px-2 py-1.5 outline-none border-[1px] rounded border-neutral-300  placeholder:text-neutral-400 placeholder:text-xs w-full"
                />

                {state?.errors?.firstName && (
                  <p className="text-xs text-red-500">
                    {state.errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="lastName"
                  className="text-xs text-neutral-600 font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="ex:Doe"
                  className="text-black px-2 py-1.5 outline-none border-[1px] rounded border-neutral-300  placeholder:text-neutral-400 placeholder:text-xs w-full"
                />

                {state?.errors?.lastName && (
                  <p className="text-xs text-red-500">
                    {state.errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs text-neutral-600 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                className="text-black px-2 py-1.5 outline-none border-[1px] rounded border-neutral-300  placeholder:text-neutral-400 placeholder:text-xs"
              />

              {state?.errors?.email && (
                <p className="text-xs text-red-500">{state.errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-xs text-neutral-600 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="text-black px-2 flex items-center py-1.5 outline-none border-[1px] rounded border-neutral-300"
              />
              {state?.errors?.password && (
                <div>
                  <p className="text-xs text-red-500">Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li key={error} className="text-xs text-red-500">
                        - {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="bg-neutral-950 w-full py-2.5 text-sm cursor-pointer rounded-md text-white"
            >
              {pending ? "Submitting" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>

      <div className="-mt-4">
        <p className="text-sm text-neutral-600 flex gap-0.5 justify-center items-center">
          Already have an account?
          <span
            role="button"
            onClick={setToggleForm}
            className="text-blue-500 underline underline-offset-1 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>

      <div className="flex flex-col space-y-8 -mt-3">
        <p className="text-[8px] leading-0 text-center text-gray-400">
          Or sign up with
        </p>
        <OauthButtons />
      </div>
    </div>
  );
};

export default SignUpForm;
