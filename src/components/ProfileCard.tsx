"use client";

import { Film, Moon, UserRound } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { User } from "@/types";
import { logout } from "@/features/auth/server/actions";

const UserAvatar = dynamic(() => import("./UserAvatar"));

const ProfileCard = ({ user }: { user: User }) => {
  if (!user) {
    return (
      <div className="relative rounded-xl w-[250px] bg-slate-200  px-2 py-2 flex flex-col gap-2">
        <p className="text-sm text-center">Sign In to view your account</p>

        <Link
          href={"/auth/login"}
          className="flex text-sm py-3 items-center justify-center bg-neutral-600 text-neutral-100 cursor-pointer rounded-lg"
        >
          Sign in
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-xl divide-y-[1px] divide-neutral-500 w-[250px] bg-slate-200">
      <div className="flex gap-2 p-2">
        <UserAvatar user={user} size="lg" />
        <div className="flex flex-col">
          <p className="font-semibold text-neutral-800">{user.username}</p>
          <p className="text-neutral-700 text-xs break-all">{user.email}</p>
        </div>
      </div>
      <div className="px-2 py-2 text-sm">
        <div className="flex flex-col gap-1">
          <Link
            href={`/account/lists`}
            className="flex items-center gap-2 py-3  px-2 transition-colors group hover:bg-neutral-300 hover:text-neutral-950 rounded-lg"
          >
            <span>
              <Film
                size={16}
                className="text-gray-500 group-hover:text-neutral-800"
              />
            </span>
            My Lists
          </Link>

          <Link
            href={`/account/profile`}
            className="flex items-center gap-2 py-3  px-2 transition-colors group hover:bg-neutral-300 hover:text-neutral-950 rounded-lg"
          >
            <span>
              <UserRound
                size={16}
                className="text-gray-500 group-hover:text-neutral-800"
              />
            </span>
            Account Settings
          </Link>
          <div className="transition-colors group flex items-center gap-2 py-3 cursor-pointer  px-2 hover:bg-neutral-300 hover:text-neutral-950 rounded-lg">
            <span>
              <Moon
                size={16}
                className="text-gray-500 group-hover:text-neutral-800"
              />
            </span>
            Dark Mode
          </div>
        </div>
      </div>
      <div className="px-2 pt-1.5 pb-2  w-full">
        <button
          onClick={async () => await logout()}
          type="button"
          className=" text-sm  w-full py-3 items-center bg-neutral-600 text-neutral-100 cursor-pointer rounded-lg"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
