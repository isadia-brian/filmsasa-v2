import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { User as LucideUser } from "lucide-react";

const UserAvatar = ({ user, size }: { user: User; size?: string }) => {
  if (!user) {
    return (
      <Avatar className={`bg-white${size === "lg" ? "h-10 w-10" : ""}`}>
        <AvatarFallback>
          <LucideUser className="h-full" size={20} color="black" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const { username } = user ?? null;

  const userInitial = username?.charAt(0).toUpperCase();

  return (
    <Avatar className={`${size === "lg" && "h-10 w-10"}`}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback className="text-lg">{userInitial}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
