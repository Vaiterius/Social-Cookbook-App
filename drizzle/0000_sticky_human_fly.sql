CREATE TYPE "public"."activity_type" AS ENUM('recipe_published', 'cookbook_published', 'recipe_forked', 'recipe_added_to_cookbook', 'made_this');--> statement-breakpoint
CREATE TYPE "public"."cookbook_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."cookbook_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."recipe_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."recipe_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."recipe_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"type" "activity_type" NOT NULL,
	"recipe_id" uuid,
	"cookbook_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cookbook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"cover_image_key" text,
	"visibility" "cookbook_visibility" NOT NULL,
	"status" "cookbook_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cookbook_recipe" (
	"cookbook_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cookbook_recipe_cookbook_id_recipe_id_pk" PRIMARY KEY("cookbook_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "course_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "course_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "cuisine" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cuisine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "cuisine_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "custom_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "custom_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "custom_tag_name_lowercase" CHECK ("custom_tag"."name" = lower("custom_tag"."name"))
);
--> statement-breakpoint
CREATE TABLE "dietary_preference" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dietary_preference_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "dietary_preference_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "discovery_tag" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "discovery_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "discovery_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "follow" (
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follow_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "follow_no_self_reference" CHECK ("follow"."follower_id" <> "follow"."following_id")
);
--> statement-breakpoint
CREATE TABLE "made_this" (
	"user_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "made_this_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(100),
	"caption" varchar(250),
	"cover_image_key" text,
	"prep_time_minutes" integer,
	"cook_time_minutes" integer,
	"servings" integer,
	"difficulty" "recipe_difficulty",
	"authors_note" varchar(250),
	"calories" integer,
	"protein_grams" integer,
	"carbs_grams" integer,
	"fat_grams" integer,
	"fiber_grams" integer,
	"visibility" "recipe_visibility" NOT NULL,
	"status" "recipe_status" NOT NULL,
	"source_name" text,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "recipe_course" (
	"recipe_id" uuid NOT NULL,
	"course_id" integer NOT NULL,
	CONSTRAINT "recipe_course_recipe_id_course_id_pk" PRIMARY KEY("recipe_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_cuisine" (
	"recipe_id" uuid NOT NULL,
	"cuisine_id" integer NOT NULL,
	CONSTRAINT "recipe_cuisine_recipe_id_cuisine_id_pk" PRIMARY KEY("recipe_id","cuisine_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_custom_tag" (
	"recipe_id" uuid NOT NULL,
	"custom_tag_id" uuid NOT NULL,
	CONSTRAINT "recipe_custom_tag_recipe_id_custom_tag_id_pk" PRIMARY KEY("recipe_id","custom_tag_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_dietary_preference" (
	"recipe_id" uuid NOT NULL,
	"dietary_preference_id" integer NOT NULL,
	CONSTRAINT "recipe_dietary_preference_recipe_id_dietary_preference_id_pk" PRIMARY KEY("recipe_id","dietary_preference_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_discovery_tag" (
	"recipe_id" uuid NOT NULL,
	"discovery_tag_id" integer NOT NULL,
	CONSTRAINT "recipe_discovery_tag_recipe_id_discovery_tag_id_pk" PRIMARY KEY("recipe_id","discovery_tag_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_fork" (
	"child_recipe_id" uuid PRIMARY KEY NOT NULL,
	"parent_recipe_id" uuid NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_fork_no_self_reference" CHECK ("recipe_fork"."child_recipe_id" <> "recipe_fork"."parent_recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredient" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"quantity" numeric,
	"unit" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_instruction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"text" varchar(500) NOT NULL,
	"image_key" text
);
--> statement-breakpoint
CREATE TABLE "recipe_personal_note" (
	"user_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"note" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_personal_note_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "saved_cookbook" (
	"user_id" uuid NOT NULL,
	"cookbook_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_cookbook_user_id_cookbook_id_pk" PRIMARY KEY("user_id","cookbook_id")
);
--> statement-breakpoint
CREATE TABLE "saved_recipe" (
	"user_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_recipe_user_id_recipe_id_pk" PRIMARY KEY("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"avatar_image_key" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_cookbook_id_cookbook_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbook"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook" ADD CONSTRAINT "cookbook_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_recipe" ADD CONSTRAINT "cookbook_recipe_cookbook_id_cookbook_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbook"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cookbook_recipe" ADD CONSTRAINT "cookbook_recipe_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "made_this" ADD CONSTRAINT "made_this_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "made_this" ADD CONSTRAINT "made_this_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_course" ADD CONSTRAINT "recipe_course_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_course" ADD CONSTRAINT "recipe_course_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_cuisine" ADD CONSTRAINT "recipe_cuisine_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_cuisine" ADD CONSTRAINT "recipe_cuisine_cuisine_id_cuisine_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisine"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_custom_tag" ADD CONSTRAINT "recipe_custom_tag_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_custom_tag" ADD CONSTRAINT "recipe_custom_tag_custom_tag_id_custom_tag_id_fk" FOREIGN KEY ("custom_tag_id") REFERENCES "public"."custom_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_dietary_preference" ADD CONSTRAINT "recipe_dietary_preference_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_dietary_preference" ADD CONSTRAINT "recipe_dietary_preference_dietary_preference_id_dietary_preference_id_fk" FOREIGN KEY ("dietary_preference_id") REFERENCES "public"."dietary_preference"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_discovery_tag" ADD CONSTRAINT "recipe_discovery_tag_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_discovery_tag" ADD CONSTRAINT "recipe_discovery_tag_discovery_tag_id_discovery_tag_id_fk" FOREIGN KEY ("discovery_tag_id") REFERENCES "public"."discovery_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_fork" ADD CONSTRAINT "recipe_fork_child_recipe_id_recipe_id_fk" FOREIGN KEY ("child_recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_fork" ADD CONSTRAINT "recipe_fork_parent_recipe_id_recipe_id_fk" FOREIGN KEY ("parent_recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_instruction" ADD CONSTRAINT "recipe_instruction_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_personal_note" ADD CONSTRAINT "recipe_personal_note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_personal_note" ADD CONSTRAINT "recipe_personal_note_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_cookbook" ADD CONSTRAINT "saved_cookbook_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_cookbook" ADD CONSTRAINT "saved_cookbook_cookbook_id_cookbook_id_fk" FOREIGN KEY ("cookbook_id") REFERENCES "public"."cookbook"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipe" ADD CONSTRAINT "saved_recipe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recipe" ADD CONSTRAINT "saved_recipe_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipe"("id") ON DELETE no action ON UPDATE no action;