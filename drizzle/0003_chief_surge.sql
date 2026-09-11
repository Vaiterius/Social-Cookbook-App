-- Preserve IDs and recipe associations while normalizing existing taxonomy.
-- Case-only duplicates cause a unique-constraint failure and roll back the migration;
-- do not silently delete or merge categories that may already be in use.
UPDATE "course" SET "name" = lower("name");
--> statement-breakpoint
UPDATE "cuisine" SET "name" = lower("name");
--> statement-breakpoint
UPDATE "dietary_preference" SET "name" = lower("name");
--> statement-breakpoint
UPDATE "discovery_tag" SET "name" = lower("name");
--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_name_lowercase" CHECK ("course"."name" = lower("course"."name"));--> statement-breakpoint
ALTER TABLE "cuisine" ADD CONSTRAINT "cuisine_name_lowercase" CHECK ("cuisine"."name" = lower("cuisine"."name"));--> statement-breakpoint
ALTER TABLE "dietary_preference" ADD CONSTRAINT "dietary_preference_name_lowercase" CHECK ("dietary_preference"."name" = lower("dietary_preference"."name"));--> statement-breakpoint
ALTER TABLE "discovery_tag" ADD CONSTRAINT "discovery_tag_name_lowercase" CHECK ("discovery_tag"."name" = lower("discovery_tag"."name"));