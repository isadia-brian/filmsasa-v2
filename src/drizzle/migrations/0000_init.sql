CREATE TABLE `film_categories` (
	`film_tmdb_id` integer,
	`category` text,
	`updated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`film_tmdb_id`) REFERENCES `films`(`tmdb_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `film_category_unique` ON `film_categories` (`film_tmdb_id`,`category`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `film_categories` (`category`);--> statement-breakpoint
CREATE INDEX `film_tmdbId_idx` ON `film_categories` (`film_tmdb_id`);--> statement-breakpoint
CREATE TABLE `films` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tmdb_id` integer NOT NULL,
	`title` text NOT NULL,
	`overview` text NOT NULL,
	`content_type` text NOT NULL,
	`media_type` text DEFAULT 'movie' NOT NULL,
	`genres` text NOT NULL,
	`year` integer NOT NULL,
	`poster_image_data` blob NOT NULL,
	`quality` text DEFAULT 'HD' NOT NULL,
	`backdrop_image_data` blob NOT NULL,
	`rating` integer,
	`seasons` integer,
	`runtime` text,
	`updated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `films_tmdb_id_unique` ON `films` (`tmdb_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tmdb_idx` ON `films` (`tmdb_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `films` (`title`);--> statement-breakpoint
CREATE INDEX `content_type_idx` ON `films` (`content_type`);--> statement-breakpoint
CREATE TABLE `user_films` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tmdb_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`title` text NOT NULL,
	`media_type` text NOT NULL,
	`poster_image` text,
	`year` integer,
	`rating` integer,
	`is_favorite` integer DEFAULT false,
	`is_watchlist` integer DEFAULT false,
	`updated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_film_unique` ON `user_films` (`user_id`,`tmdb_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `user_films` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_filmtmdb_idx` ON `user_films` (`tmdb_id`);--> statement-breakpoint
CREATE INDEX `favorite_idx` ON `user_films` (`is_favorite`);--> statement-breakpoint
CREATE INDEX `watchlist_idx` ON `user_films` (`is_watchlist`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text NOT NULL,
	`email` text,
	`password` text,
	`user_roles` text DEFAULT 'user' NOT NULL,
	`updated_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);