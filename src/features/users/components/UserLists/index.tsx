import { getUser } from "@/lib/dal";
import UserList from "./component.client";
import { redirect } from "next/navigation";
import { fetchUserData } from "../../server/db";

const UserLists = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const data = await fetchUserData(user.id);

  const watchlistFilms = data?.watchlist || [];
  const favoriteFilms = data?.favorites || [];

  return (
    <div className="flex flex-col gap-8">
      <UserList title="WatchList" films={watchlistFilms} />
      <UserList title="Favourites" films={favoriteFilms} />
    </div>
  );
};

export default UserLists;
