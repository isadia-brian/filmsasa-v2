"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Film, Moon, UserRound } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
//import LogoutButton from "@/app/auth/LogoutButton"
import { User } from "@/types";

const UserAvatar = dynamic(() => import("./UserAvatar"));

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Card className=" rounded-(--card-radius) divide-y-[1px] max-w-[500px] [--card-radius:var(--radius-3xl)]">
      <CardHeader className="flex flex-row gap-2 p-2">
        <UserAvatar user={user} size="lg" />
        <div className="flex flex-col">
          <p className="font-semibold text-neutral-800">{user?.username}</p>
          <p className="text-gray-500 text-[2px]">{user?.email}</p>
        </div>
      </CardHeader>
      <CardContent className="px-2 py-2 text-sm">
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
          <div className="transition-colors group flex items-center gap-2 py-3  px-2 hover:bg-neutral-300 hover:text-neutral-950 rounded-lg">
            <span>
              <Moon
                size={16}
                className="text-gray-500 group-hover:text-neutral-800"
              />
            </span>
            Dark Mode
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2">{/* <LogoutButton />*/}</CardFooter>
    </Card>
  );
};

export default ProfileCard;
