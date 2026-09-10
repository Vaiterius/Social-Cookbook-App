CREATE TABLE "recipe_instruction_ingredient" (
	"instruction_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"quantity_used" numeric,
	CONSTRAINT "recipe_instruction_ingredient_instruction_id_ingredient_id_pk" PRIMARY KEY("instruction_id","ingredient_id")
);
--> statement-breakpoint
ALTER TABLE "recipe_instruction_ingredient" ADD CONSTRAINT "recipe_instruction_ingredient_instruction_id_recipe_instruction_id_fk" FOREIGN KEY ("instruction_id") REFERENCES "public"."recipe_instruction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_instruction_ingredient" ADD CONSTRAINT "recipe_instruction_ingredient_ingredient_id_recipe_ingredient_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."recipe_ingredient"("id") ON DELETE no action ON UPDATE no action;