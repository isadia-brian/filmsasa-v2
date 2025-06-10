"use server";

import { db } from "@/db";
import { userFilms, users } from "@/db/schema";
import { FilmData } from "@/types/films";
import { and, desc, eq, or } from "drizzle-orm";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

type UserListData =
  | {
      tmdbId: number;
      title: string;
      rating: number | null;
      year: number | null;
      mediaType: "movie" | "tv";
      posterImage: string | null;
    }[]
  | null;

const getUser = async (userId: number) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
};

export const fetchUserData = unstable_cache(
  async (
    userId: number,
  ): Promise<{ favorites: UserListData; watchlist: UserListData } | null> => {
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

    const userFavorites = existingUser.userFilms.filter((uf) => uf.isFavorite);
    const userWatchlist = existingUser.userFilms.filter((uf) => uf.isWatchlist);

    const favorites = userFavorites.map((uf) => ({
      tmdbId: uf.tmdbId,
      title: uf.title,
      mediaType: uf.mediaType,
      posterImage: uf.posterImage,
      year: uf.year,
      rating: uf.rating,
    }));

    const watchlist = userWatchlist.map((uw) => ({
      tmdbId: uw.tmdbId,
      title: uw.title,
      mediaType: uw.mediaType,
      posterImage: uw.posterImage,
      year: uw.year,
      rating: uw.rating,
    }));

    return {
      favorites,
      watchlist,
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
      if (!existingUser) {
        return {
          success: false,
          message: "Please sign in or sign up to save films",
        };
      }

      // Check for existing film in user's list
      const existingFilm = await db.query.userFilms.findFirst({
        where: and(eq(userFilms.userId, userId), eq(userFilms.tmdbId, tmdbId)),
      });

      // Handle duplication checks
      if (action === "favorites" && existingFilm?.isFavorite) {
        return {
          success: false,
          message: `${filmData.title} is already in your favorites`,
        };
      }

      if (action === "watchlist" && existingFilm?.isWatchlist) {
        return {
          success: false,
          message: `${filmData.title} is already in your watchlist`,
        };
      }

      // Prepare update object based on action
      const updateData = {
        title: filmData.title,
        mediaType: filmData.mediaType,
        posterImage: filmData.posterImage,
        year: filmData.year,
        rating: filmData.rating,
        updated_at: new Date(),
        ...(action === "favorites"
          ? { isFavorite: true }
          : { isWatchlist: true }),
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
          set: updateData,
        });

      revalidateTag("user_data");
      revalidatePath("/");
      revalidatePath(`/account/${action}`);

      return {
        success: true,
        message: `${filmData.title} has been ${
          existingFilm ? "added to" : "updated in"
        } your ${action} successfully`,
      };
    } catch (error) {
      console.error(`An error occurred: ${error}`);
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
