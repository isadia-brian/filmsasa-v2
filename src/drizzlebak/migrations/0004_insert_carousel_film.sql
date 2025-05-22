CREATE TABLE "carouselFilms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "carouselFilms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tmdb_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"overview" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"rating" integer NOT NULL,
	"seasons" integer,
	"runtime" varchar,
	"genres" jsonb NOT NULL,
	"backdrop_image_data" "bytea" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "carouselFilms_tmdb_id_unique" UNIQUE("tmdb_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "carousel_tmdb_idx" ON "carouselFilms" USING btree ("tmdb_id");--> statement-breakpoint
CREATE INDEX "caousel_title_idx" ON "carouselFilms" USING btree ("title");--> statement-breakpoint
CREATE INDEX "carousel_content_type_idx" ON "carouselFilms" USING btree ("content_type");