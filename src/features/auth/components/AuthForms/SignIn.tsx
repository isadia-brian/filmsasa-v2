"use client";

import { useActionState } from "react";
import { modalSignIn } from "@/features/auth/server/actions";
import { XCircleIcon } from "lucide-react";
import OauthButton from "./OauthButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SignInForm = ({ toggleAuth }: { toggleAuth: () => void }) => {
  const [state, action, pending] = useActionState(modalSignIn, undefined);
  const router = useRouter();

  if (state?.success === true) {
    const handleSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.refresh();
      toggleAuth();
    };
    handleSuccess();
  }

  return (
    <div className="space-y-10 bg-slate-50 px-3 pt-2 pb-3 text-neutral-600 rounded-md">
      <div className="flex flex-col space-y-4.5">
        <div className="flex flex-col space-y-1.5 ">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-lg">Login</h5>
            <button
              type="button"
              className="cursor-pointer"
              onClick={toggleAuth}
            >
              <XCircleIcon className="text-neutral-500" />
            </button>
          </div>
          <p className="text-sm  text-pretty">
            Enter your email below to login to your account
          </p>
        </div>
        <form action={action}>
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[13px] font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                required
                name="email"
                placeholder="johndoe@example.com"
                className="text-black px-2 py-1.5 outline-none border-[1px] rounded border-neutral-300  placeholder:text-neutral-400 placeholder:text-xs"
              />

              {state?.errors?.email && (
                <p className="text-xs text-red-500">{state.errors.email}</p>
              )}
            </div>
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
                required
                name="password"
                className="text-black px-2 flex items-center py-1.5 outline-none border-[1px] rounded border-neutral-300"
              />
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
              {pending ? "Submitting" : "Login"}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col space-y-8 -mt-3">
        <p className="text-xs leading-0 text-center text-gray-400">
          Or sign in with
        </p>
        <OauthButton />
      </div>
    </div>
  );
};

export default SignInForm;
