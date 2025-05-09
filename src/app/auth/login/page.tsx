import { LoginForm } from "@/features/auth/components/AuthForms/LoginPageForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image
                src={"/logo.webp"}
                height={24}
                width={24}
                className="object-contain"
                alt="logo"
              />
            </div>
            <p className="text-red-500">Filmsasa.</p>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
