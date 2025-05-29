"use server";

import { db } from "@/db";
import { userFilms, users } from "@/db/schema";
import { FilmData } from "@/types/films";
import { and, desc, eq, or } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

const getUser = async (userId: number) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
};

export const fetchUserData = unstable_cache(
  async (userId: number) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),

      with: {
        userFilms: {
          where: or(
            eq(userFilms.isFavorite, true),
            eq(userFilms.isWatchlist, true),
          ),
          orderBy: [desc(userFilms.updated_at)],
        },
      },
    });

    if (!existingUser) return null;

    //separate favourites and watchlist

    const favorites = existingUser.userFilms.filter((uf) => uf.isFavorite);
    const watchlist = existingUser.userFilms.filter((uf) => uf.isWatchlist);

    return {
      favorites: favorites.map((uf) => ({
        tmdbId: uf.tmdbId,
        title: uf.title,
        mediaType: uf.mediaType,
        posterImage: uf.posterImage,
        year: uf.year,
        rating: uf.rating,
      })),
      watchlist: watchlist.map((uf) => ({
        tmdbId: uf.tmdbId,
        title: uf.title,
        mediaType: uf.mediaType,
        posterImage: uf.posterImage,
        year: uf.year,
        rating: uf.rating,
      })),
    };
  },
  ["user_data"],
  { revalidate: 3600 },
);

export const addToUserList = cache(
  async (
    userId: number,
    tmdbId: number,
    action: "favorites" | "watchlist",
    filmData: FilmData,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const existingUser = await getUser(userId);

      if (!existingUser)
        return {
          success: false,
          message: "Please sign in or sign up to save films",
        };

      await db
        .insert(userFilms)
        .values({
          userId,
          tmdbId,
          ...filmData,
          isFavorite: action === "favorites",
          isWatchlist: action === "watchlist",
        })
        .onConflictDoUpdate({
          target: [userFilms.userId, userFilms.tmdbId],
          set: {
            [action]: true,
            title: filmData.title,
            mediaType: filmData.mediaType,
            posterImage: filmData.posterImage,
            year: filmData.year,
            rating: filmData.rating,
            updated_at: new Date(),
          },
        });

      revalidateTag("user_data");
      revalidatePath("/");
      revalidatePath(`/account/${action}`);

      return {
        success: true,
        message: `${filmData.title} has been added to your ${action} successfully`,
      };
    } catch (error) {
      console.log(`An error occured: ${error}`);
      return {
        success: false,
        message: "An error occurred on the server",
      };
    }
  },
);

export const removeFromUserList = cache(
  async (
    userId: number,
    tmdbId: number,
    action: "favorites" | "watchlist",
  ): Promise<{ success: boolean; message: string }> => {
    try {
      await db.transaction(async (tx) => {
        // Get current state
        const current = await tx.query.userFilms.findFirst({
          where: and(
            eq(userFilms.userId, userId),
            eq(userFilms.tmdbId, tmdbId),
          ),
        });

        if (!current)
          return {
            success: false,
            message: "The film is not in your lists",
          };

        // Calculate new values
        const newState = {
          isFavorite: action === "favorites" ? false : current.isFavorite,
          isWatchlist: action === "watchlist" ? false : current.isWatchlist,
        };

        // Delete if both flags are false, otherwise update
        if (!newState.isFavorite && !newState.isWatchlist) {
          await tx
            .delete(userFilms)
            .where(
              and(eq(userFilms.userId, userId), eq(userFilms.tmdbId, tmdbId)),
            );
        } else {
          await tx
            .update(userFilms)
            .set({ ...newState, updated_at: new Date() })
            .where(
              and(eq(userFilms.userId, userId), eq(userFilms.tmdbId, tmdbId)),
            );
        }
      });
      revalidateTag("user_data");
      revalidatePath(`/account/${action}`);
      return {
        success: true,
        message: `${userFilms.title} has been deleted successfully`,
      };
    } catch (error) {
      console.log(`An error occured: ${error}`);
      return {
        success: false,
        message: "An error occurred on the server",
      };
    }
  },
);
