import { SignUpPageForm } from "@/features/auth/components/AuthForms/SignUpPageForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image
                src={"/logo.webp"}
                height={24}
                width={24}
                className="object-contain"
                alt="logo"
              />
            </div>
            <p className="text-red-500">Filmsasa</p>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpPageForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="h-full w-full relative">
          <Image
            src={"/postergrid.webp"}
            fill
            alt="postergrid"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
