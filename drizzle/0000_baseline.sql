CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`actor` text NOT NULL,
	`meta` text,
	`occurred_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_log_occurred_idx` ON `audit_log` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `audit_log_target_idx` ON `audit_log` (`target`);--> statement-breakpoint
CREATE TABLE `films` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`duration` text DEFAULT '' NOT NULL,
	`poster_url` text NOT NULL,
	`video_url` text NOT NULL,
	`kind` text DEFAULT 'feature' NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`alt` text NOT NULL,
	`tag` text NOT NULL,
	`height` integer DEFAULT 6 NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `instagram_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`caption` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`comments` integer DEFAULT 0 NOT NULL,
	`plays` integer,
	`kind` text DEFAULT 'post' NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`success` integer DEFAULT false NOT NULL,
	`attempted_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `login_attempts_ip_time_idx` ON `login_attempts` (`ip`,`attempted_at`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote` text NOT NULL,
	`couple` text NOT NULL,
	`place` text DEFAULT '' NOT NULL,
	`date` text DEFAULT '' NOT NULL,
	`accent` text DEFAULT 'plum' NOT NULL,
	`sort_order` integer DEFAULT 100 NOT NULL,
	`created_at` text NOT NULL
);
