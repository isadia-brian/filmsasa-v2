CREATE TYPE "public"."content_type" AS ENUM('movie', 'tv', 'kids');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('movie', 'tv');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "film_categories" (
	"film_tmdb_id" integer,
	"category" varchar(20),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "films" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "films_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tmdb_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"overview" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"media_type" "media_type" DEFAULT 'movie' NOT NULL,
	"poster_image" varchar(255) NOT NULL,
	"quality" varchar(20) DEFAULT 'HD' NOT NULL,
	"backdrop_image" varchar(255) NOT NULL,
	"genres" jsonb NOT NULL,
	"year" integer,
	"rating" integer,
	"seasons" integer,
	"runtime" varchar,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "films_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE TABLE "user_favorites" (
	"user_id" integer NOT NULL,
	"film_tmdb_id" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_watchlist" (
	"user_id" integer NOT NULL,
	"film_tmdb_id" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255),
	"user_name" varchar(255) NOT NULL,
	"email" varchar(255),
	"password" varchar(512),
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "film_categories" ADD CONSTRAINT "film_categories_film_tmdb_id_films_tmdb_id_fk" FOREIGN KEY ("film_tmdb_id") REFERENCES "public"."films"("tmdb_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_film_tmdb_id_films_tmdb_id_fk" FOREIGN KEY ("film_tmdb_id") REFERENCES "public"."films"("tmdb_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_watchlist" ADD CONSTRAINT "user_watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_watchlist" ADD CONSTRAINT "user_watchlist_film_tmdb_id_films_tmdb_id_fk" FOREIGN KEY ("film_tmdb_id") REFERENCES "public"."films"("tmdb_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "film_category_unique" ON "film_categories" USING btree ("film_tmdb_id","category");--> statement-breakpoint
CREATE INDEX "category_idx" ON "film_categories" USING btree ("category");--> statement-breakpoint
CREATE INDEX "film_tmdbId_idx" ON "film_categories" USING btree ("film_tmdb_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tmdb_idx" ON "films" USING btree ("tmdb_id");--> statement-breakpoint
CREATE INDEX "title_idx" ON "films" USING btree ("title");--> statement-breakpoint
CREATE INDEX "content_type_idx" ON "films" USING btree ("content_type");--> statement-breakpoint
CREATE UNIQUE INDEX "user_favorite_unique" ON "user_favorites" USING btree ("user_id","film_tmdb_id");--> statement-breakpoint
CREATE INDEX "user_favorite_idx" ON "user_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "film_favorite_tmdbId_idx" ON "user_favorites" USING btree ("film_tmdb_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_watchlist_unique" ON "user_watchlist" USING btree ("user_id","film_tmdb_id");--> statement-breakpoint
CREATE INDEX "user_watchlist_idx" ON "user_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "film_watchlist_tmdbId_idx" ON "user_watchlist" USING btree ("film_tmdb_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");