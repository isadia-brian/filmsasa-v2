import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

const timestamps = {
  updated_at: t
    .integer("updated_at", { mode: "timestamp" })
    .$onUpdateFn(() => new Date()),
  created_at: t
    .integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];

// Because sqlite doesnt have native enums
// We can use text with constraints

export const contentTypeEnum = t.text("content_type", {
  enum: ["movie", "tv", "kids"],
});
export const mediaTypeEnum = t.text("media_type", { enum: ["movie", "tv"] });
export const userRoleEnum = t.text("user_roles", { enum: userRoles });

export const films = table(
  "films",
  {
    id: t.integer("id").primaryKey({ autoIncrement: true }),
    tmdbId: t.integer("tmdb_id").notNull().unique(),
    title: t.text("title").notNull(),
    overview: t.text("overview").notNull(),
    contentType: contentTypeEnum.notNull(),
    mediaType: mediaTypeEnum.default("movie").notNull(),
    genres: t.text("genres").notNull().$type<string[]>(),
    year: t.integer("year").notNull(),
    posterImage: t.blob("poster_image_data").notNull(),
    quality: t.text("quality").notNull().default("HD"),
    backdropImage: t.blob("backdrop_image_data").notNull(),
    rating: t.integer("rating"),
    seasons: t.integer("seasons"),
    runtime: t.text("runtime"),
    ...timestamps,
  },
  (table) => ({
    tmdbIdx: t.uniqueIndex("tmdb_idx").on(table.tmdbId),
    titleIdx: t.index("title_idx").on(table.title),
    contentTypeIdx: t.index("content_type_idx").on(table.contentType),
  }),
);

export const filmCategories = table(
  "film_categories",
  {
    filmTmdbId: t
      .integer("film_tmdb_id")
      .references(() => films.tmdbId, { onDelete: "cascade" }),
    category: t.text("category"), // 'trending', 'popular','carousel'
    ...timestamps,
  },
  (table) => ({
    filmCategoryUnique: t
      .uniqueIndex("film_category_unique")
      .on(table.filmTmdbId, table.category),
    categoryIdx: t.index("category_idx").on(table.category),
    filmTmdbIdIdx: t.index("film_tmdbId_idx").on(table.filmTmdbId),
  }),
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

export const userFilms = table(
  "user_films",
  {
    id: t.integer("id").primaryKey({ autoIncrement: true }),
    tmdbId: t.integer("tmdb_id").notNull(),
    userId: t
      .integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: t.text("title").notNull(),
    mediaType: t.text("media_type", { enum: ["movie", "tv"] }).notNull(),
    posterImage: t.text("poster_image"),
    year: t.integer("year"),
    rating: t.integer("rating"),
    // User-specific metadata
    isFavorite: t.integer("is_favorite", { mode: "boolean" }).default(false),
    isWatchlist: t.integer("is_watchlist", { mode: "boolean" }).default(false),
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

// Updated users table (removed old favorites/watchlist relations)
export const users = table(
  "users",
  {
    id: t.integer("id").primaryKey({ autoIncrement: true }),
    username: t.text("user_name").notNull(),
    email: t.text("email").unique(),
    password: t.text("password"),
    role: userRoleEnum.default("user").notNull(),
    ...timestamps,
  },
  (table) => ({
    emailIdx: t.uniqueIndex("email_idx").on(table.email),
  }),
);

// Updated relations
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
