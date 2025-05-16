"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { signin } from "../../server/actions";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, pending] = useActionState(signin, undefined);
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={action}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl text-slate-50 font-bold">
          Login to your account
        </h1>
        <p className="text-neutral-400 text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-neutral-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="doe@example.com"
            required
            className="text-neutral-50"
          />
          {state?.errors.email && (
            <p className="text-xs text-red-500">{state.errors.email}</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-neutral-300">
              Password
            </Label>
            <a
              href="#"
              className="ml-auto text-xs underline-offset-4 hover:underline text-neutral-400"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            className="text-neutral-50"
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
          disabled={pending}
          className="w-full bg-gray-50 text-gray-900 hover:bg-gray-100 cursor-pointer "
        >
          {pending ? "Submitting" : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-neutral-400 text-neutral-800 relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer">
          <div className="relative h-5 w-5">
            <Image
              src="/google.svg"
              alt="Google"
              fill
              className="object-cover"
            />
          </div>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm text-neutral-300">
        Don&apos;t have an account?{" "}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
