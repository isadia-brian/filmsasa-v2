import { getUser } from "@/lib/dal";
import UserList from "./component.client";
import { redirect } from "next/navigation";
import { fetchUserData } from "../../server/db";

const UserLists = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id;

  const data = await fetchUserData(userId);

  const watchlistFilms = data?.watchlist || [];
  const favoriteFilms = data?.favorites || [];

  return (
    <div className="flex flex-col gap-8">
      <UserList
        title="WatchList"
        films={watchlistFilms}
        userId={userId}
        action="watchlist"
      />
      <UserList
        title="Favourites"
        films={favoriteFilms}
        userId={userId}
        action="favorites"
      />
    </div>
  );
};

export default UserLists;
