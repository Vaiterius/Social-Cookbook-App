import { relations } from 'drizzle-orm'
import * as schema from './schema'

// Foreign keys enforce integrity; these declarations let Drizzle assemble nested
// recipe reads. Keep query metadata separate from migration definitions.
export const recipeRelations = relations(schema.recipe, ({ many, one }) => ({
  ingredients: many(schema.recipeIngredient),
  instructions: many(schema.recipeInstruction),
  courses: many(schema.recipeCourse),
  cuisines: many(schema.recipeCuisine),
  dietaryPreferences: many(schema.recipeDietaryPreference),
  discoveryTags: many(schema.recipeDiscoveryTag),
  customTags: many(schema.recipeCustomTag),
  // Follow the child edge to its source, rather than collecting this recipe's descendants.
  fork: one(schema.recipeFork, {
    fields: [schema.recipe.id],
    references: [schema.recipeFork.childRecipeId],
    relationName: 'forkChild',
  }),
}))

export const recipeIngredientRelations = relations(
  schema.recipeIngredient,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeIngredient.recipeId],
      references: [schema.recipe.id],
    }),
  }),
)

export const recipeInstructionRelations = relations(
  schema.recipeInstruction,
  ({ one, many }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeInstruction.recipeId],
      references: [schema.recipe.id],
    }),
    ingredientUsages: many(schema.recipeInstructionIngredient),
  }),
)

export const recipeInstructionIngredientRelations = relations(
  schema.recipeInstructionIngredient,
  ({ one }) => ({
    instruction: one(schema.recipeInstruction, {
      fields: [schema.recipeInstructionIngredient.instructionId],
      references: [schema.recipeInstruction.id],
    }),
  }),
)

export const recipeCourseRelations = relations(
  schema.recipeCourse,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeCourse.recipeId],
      references: [schema.recipe.id],
    }),
    course: one(schema.course, {
      fields: [schema.recipeCourse.courseId],
      references: [schema.course.id],
    }),
  }),
)

export const recipeCuisineRelations = relations(
  schema.recipeCuisine,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeCuisine.recipeId],
      references: [schema.recipe.id],
    }),
    cuisine: one(schema.cuisine, {
      fields: [schema.recipeCuisine.cuisineId],
      references: [schema.cuisine.id],
    }),
  }),
)

export const recipeDietaryPreferenceRelations = relations(
  schema.recipeDietaryPreference,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeDietaryPreference.recipeId],
      references: [schema.recipe.id],
    }),
    dietaryPreference: one(schema.dietaryPreference, {
      fields: [schema.recipeDietaryPreference.dietaryPreferenceId],
      references: [schema.dietaryPreference.id],
    }),
  }),
)

export const recipeDiscoveryTagRelations = relations(
  schema.recipeDiscoveryTag,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeDiscoveryTag.recipeId],
      references: [schema.recipe.id],
    }),
    discoveryTag: one(schema.discoveryTag, {
      fields: [schema.recipeDiscoveryTag.discoveryTagId],
      references: [schema.discoveryTag.id],
    }),
  }),
)

export const recipeCustomTagRelations = relations(
  schema.recipeCustomTag,
  ({ one }) => ({
    recipe: one(schema.recipe, {
      fields: [schema.recipeCustomTag.recipeId],
      references: [schema.recipe.id],
    }),
    customTag: one(schema.customTag, {
      fields: [schema.recipeCustomTag.customTagId],
      references: [schema.customTag.id],
    }),
  }),
)

export const recipeForkRelations = relations(schema.recipeFork, ({ one }) => ({
  childRecipe: one(schema.recipe, {
    fields: [schema.recipeFork.childRecipeId],
    references: [schema.recipe.id],
    relationName: 'forkChild',
  }),
  parentRecipe: one(schema.recipe, {
    fields: [schema.recipeFork.parentRecipeId],
    references: [schema.recipe.id],
    relationName: 'forkParent',
  }),
}))
