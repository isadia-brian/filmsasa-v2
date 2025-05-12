import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Helpers
const timestamps = {
  updated_at: t.timestamp().$onUpdateFn(() => new Date()),
  created_at: t.timestamp().defaultNow().notNull(),
};
export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];

// Enums
export const contentTypeEnum = pgEnum("content_type", ["movie", "tv", "kids"]);
export const mediaTypeEnum = pgEnum("media_type", ["movie", "tv"]);
export const userRoleEnum = pgEnum("user_roles", userRoles);

// Core Films Table (Normalized structure)
export const films = table(
  "films",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    tmdbId: t.integer("tmdb_id").notNull().unique(),
    title: t.varchar("title", { length: 255 }).notNull(),
    overview: t.text("overview").notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    mediaType: mediaTypeEnum("media_type").default("movie").notNull(),
    genres: t.jsonb("genres").notNull().$type<string[]>(),
    year: t.integer("year"),
    posterImage: t.varchar("poster_image", { length: 255 }).notNull(),
    quality: t.varchar("quality", { length: 20 }).notNull().default("HD"),
    backdropImage: t.varchar("backdrop_image", { length: 255 }).notNull(),
    rating: t.integer("rating"),
    seasons: t.integer("seasons"),
    runtime: t.varchar("runtime"),
    ...timestamps,
  },
  (table) => [
    t.uniqueIndex("tmdb_idx").on(table.tmdbId),
    t.index("title_idx").on(table.title),
    t.index("content_type_idx").on(table.contentType),
  ],
);

export const filmCategories = table(
  "film_categories",
  {
    filmTmdbId: t
      .integer("film_tmdb_id")
      .references(() => films.tmdbId, { onDelete: "cascade" }),
    category: t.varchar("category", { length: 20 }), // 'trending', 'popular',
    ...timestamps,
  },
  (table) => [
    t.uniqueIndex("film_category_unique").on(table.filmTmdbId, table.category), // Ensures no duplicate (filmTmdbId, category) pairs
    t.index("category_idx").on(table.category), // Speeds up queries filtering by category
    t.index("film_tmdbId_idx").on(table.filmTmdbId),
  ],
);

export const filmsRelations = relations(films, ({ many }) => ({
  filmCategories: many(filmCategories),
}));

export const filmCategoriesRelations = relations(filmCategories, ({ one }) => ({
  film: one(films, {
    fields: [filmCategories.filmTmdbId],
    references: [films.tmdbId],
  }),
}));

export const users = table(
  "users",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    username: t.varchar("user_name", { length: 255 }).notNull(),
    email: t.varchar("email", { length: 255 }).unique(),
    password: t.varchar("password", { length: 512 }),
    role: userRoleEnum("role").default("user").notNull(),
    ...timestamps,
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)],
);

//User Favorites Table
export const userFavorites = table(
  "user_favorites",
  {
    userId: t
      .integer("user_id")
      .references(() => users.id)
      .notNull(),
    filmTmdbId: t
      .integer("film_tmdb_id")
      .references(() => films.tmdbId, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.uniqueIndex("user_favorite_unique").on(table.userId, table.filmTmdbId), // Composite primary key
    t.index("user_favorite_idx").on(table.userId),
    t.index("film_favorite_tmdbId_idx").on(table.filmTmdbId),
  ],
);

//User WatchList Table

export const userWatchlist = table(
  "user_watchlist",
  {
    userId: t
      .integer("user_id")
      .references(() => users.id)
      .notNull(),
    filmTmdbId: t
      .integer("film_tmdb_id")
      .references(() => films.tmdbId, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [
    t.uniqueIndex("user_watchlist_unique").on(table.userId, table.filmTmdbId), // Composite primary key
    t.index("user_watchlist_idx").on(table.userId),
    t.index("film_watchlist_tmdbId_idx").on(table.filmTmdbId),
  ],
);

export const userRelations = relations(users, ({ many }) => ({
  userFavorites: many(userFavorites),
  userWatchlist: many(userWatchlist),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
  film: one(films, {
    fields: [userFavorites.filmTmdbId],
    references: [films.tmdbId],
  }),
}));

export const userWatchlistRelations = relations(userWatchlist, ({ one }) => ({
  user: one(users, {
    fields: [userWatchlist.userId],
    references: [users.id],
  }),
  film: one(films, {
    fields: [userWatchlist.filmTmdbId],
    references: [films.tmdbId],
  }),
}));

export type Film = typeof films.$inferSelect & {
  filmCategories?: (typeof filmCategories.$inferSelect)[];
};
export type InsertFilm = typeof films.$inferInsert;
export type FilmCategory = typeof filmCategories.$inferSelect;
export type InsertFilmCategory = typeof filmCategories.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserWithData = typeof users.$inferSelect & {
  userFavorites?: (typeof userFavorites.$inferSelect)[];
  userWatchlist?: (typeof userWatchlist.$inferSelect)[];
};
