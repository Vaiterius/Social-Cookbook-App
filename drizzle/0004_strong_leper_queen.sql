ALTER TABLE "recipe" ADD CONSTRAINT "recipe_published_fields_required" CHECK ("recipe"."status" = 'draft' or (
          "recipe"."title" is not null
          and "recipe"."caption" is not null
          and "recipe"."cover_image_key" is not null
          and "recipe"."prep_time_minutes" is not null
          and "recipe"."cook_time_minutes" is not null
          and "recipe"."servings" is not null
          and "recipe"."difficulty" is not null
          and "recipe"."authors_note" is not null
          and "recipe"."calories" is not null
          and "recipe"."protein_grams" is not null
          and "recipe"."carbs_grams" is not null
          and "recipe"."fat_grams" is not null
          and "recipe"."fiber_grams" is not null
          and "recipe"."source_name" is not null
          and "recipe"."source_url" is not null
      ));