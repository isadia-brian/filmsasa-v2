"use server";

import { db } from "@/drizzle";
import { userFilms, users } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const AddToFavorites = async (
  userId: number,
  filmId: number,
  path: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const user = await getUser(userId);

    if (!user) {
      return {
        success: false,
        message: "Please sign in to add to favorites",
      };
    }
    const existingFavorite = await db.query.userFilms.findFirst({
      where: and(eq(userFilms.userId, user.id), eq(userFilms.isFavorite, true)),
    });
    if (existingFavorite) {
      return {
        success: false,
        message: "The film is already in your favourites",
      };
    }
    //Does not exist
    await db.insert(userFilms).values({
      tmdbId: filmId,
      userId: user.id,
    });
    revalidatePath(path);
    return {
      success: true,
      message: "The film has been added to your favorites",
    };
  } catch (err) {
    return {
      success: false,
      message: `An error occured while adding a favorite`,
    };
  }
};

export const RemoveFavorite = async (
  userId: number,
  filmId: number,
  path: string,
): Promise<{ success: boolean; message?: string }> => {
  if (!userId || !filmId) {
    return {
      success: true,
      message: `A field was not provided please try again`,
    };
  }
  try {
    const user = await getUser(userId);
    if (!user) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }
    await db
      .delete(userFilms)
      .where(and(eq(userFilms.userId, userId), eq(userFilms.tmdbId, filmId)));

    revalidatePath(path);
    return {
      success: false,
      message: `The film was successfully removed from your favourites successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occured in the server while trying to remove the film from favourites`,
    };
  }
};

const getUser = async (userId: number) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
};
