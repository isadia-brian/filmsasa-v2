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

export const films = table(
  "films",
  {
    id: t.integer("id").primaryKey().generatedAlwaysAsIdentity(),
    tmdbId: t.integer("tmdb_id").notNull().unique(),
    title: t.varchar("title", { length: 255 }).notNull(),
    overview: t.varchar("overview").notNull(),
    contentType: contentTypeEnum("content_type").notNull(),
    mediaType: mediaTypeEnum("media_type").default("movie").notNull(),
    genres: t.jsonb("genres").notNull().$type<string[]>(),
    year: t.integer("year"),
    posterImage: t.varchar("poster_image", { length: 255 }).notNull(),
    quality: t.varchar("quality", { length: 20 }),
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
    image: t.varchar("image"),
    role: userRoleEnum("role").default("user").notNull(),
    ...timestamps,
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)],
);

export const userFilms = table(
  "user_films",
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    tmdbId: t.integer("tmdb_id").notNull(),
    userId: t
      .integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: t.varchar("title").notNull(),
    mediaType: mediaTypeEnum("media_type").default("movie").notNull(),
    posterImage: t.varchar("poster_image"),
    year: t.integer("year"),
    rating: t.integer("rating"),
    isFavorite: t.boolean("is_Favorite").default(false),
    isWatchlist: t.boolean("is_Watchlist").default(false),
    ...timestamps,
  },
  (table) => ({
    userFilmUnique: t
      .uniqueIndex("user_film_unique")
      .on(table.userId, table.tmdbId),
    userIdx: t.index("user_idx").on(table.userId),
    tmdbIdx: t.index("user_filmtmdb_idx").on(table.tmdbId),
    favoriteIdx: t.index("favorite_idx").on(table.isFavorite),
    watchlistIdx: t.index("watchlist_idx").on(table.isWatchlist),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  userFilms: many(userFilms),
}));

export const userFilmsRelations = relations(userFilms, ({ one }) => ({
  user: one(users, {
    fields: [userFilms.userId],
    references: [users.id],
  }),
}));

// Film types
export type Film = typeof films.$inferSelect & {
  filmCategories?: (typeof filmCategories.$inferSelect)[];
};
export type InsertFilm = typeof films.$inferInsert;
export type FilmCategory = typeof filmCategories.$inferSelect;
export type InsertFilmCategory = typeof filmCategories.$inferInsert;

// User types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserFilm = typeof userFilms.$inferSelect;
export type InsertUserFilm = typeof userFilms.$inferInsert;

// Extended types with relations
export type UserWithFilms = User & {
  userFilms?: UserFilm[];
};

export type UserFilmWithUser = UserFilm & {
  user?: User;
};

// Specialized filter types
export type UserFilmFilters = {
  userId: number;
  isFavorite?: boolean;
  isWatchlist?: boolean;
  mediaType?: "movie" | "tv";
};

// API response types
export type UserFilmResponse = Omit<UserFilm, "userId"> & {
  user: Pick<User, "id" | "username">;
};

export type BulkUserFilmsResponse = {
  favorites: UserFilm[];
  watchlist: UserFilm[];
  recentlyAdded: UserFilm[];
};
