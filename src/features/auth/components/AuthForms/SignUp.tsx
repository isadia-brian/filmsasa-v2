"use client";

import { Dispatch, SetStateAction, useActionState } from "react";
import { modalSignUp } from "@/features/auth/server/actions";
import { XCircleIcon } from "lucide-react";
import OauthButtons from "./OauthButtons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FormActions = {
  toggleAuth: () => void;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

const SignUpForm = ({ toggleAuth, setActiveTab }: FormActions) => {
  const [state, action, pending] = useActionState(modalSignUp, undefined);
  const router = useRouter();
  if (state?.success === true) {
    const handleSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.refresh();
      setActiveTab("signIn");
    };
    handleSuccess();
  }
  return (
    <div className="space-y-10 w-full bg-slate-50 px-3 pt-2 pb-3 text-neutral-600 rounded-md">
      <div className="flex flex-col space-y-4.5">
        <div className="flex flex-col space-y-1.5 ">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-lg">Sign up</h5>
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
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[13px] font-medium">
                Email
              </Label>
              <Input
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="password"
                    className="text-[13px] text-neutral-600 font-medium"
                  >
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    className="text-black px-2 flex items-center py-1.5 outline-none border-[1px] rounded border-neutral-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[13px] text-neutral-600 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="text-black px-2 flex items-center py-1.5 outline-none border-[1px] rounded border-neutral-300"
                  />
                </div>
              </div>

              {state?.errors?.password && (
                <div>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li key={error} className="text-xs text-red-500">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size={"lg"}
              disabled={pending}
              className="bg-neutral-950 w-[150px] text-sm cursor-pointer rounded-md text-white"
            >
              {pending ? "Submitting" : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col space-y-8 -mt-3">
        <p className="text-xs leading-0 text-center text-gray-400">
          Or sign up with
        </p>
        <OauthButtons />
      </div>
    </div>
  );
};

export default SignUpForm;
