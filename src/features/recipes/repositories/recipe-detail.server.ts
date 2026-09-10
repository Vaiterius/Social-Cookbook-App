import { and, eq } from 'drizzle-orm'
import { db } from '#/db'
import { madeThis, recipe, recipePersonalNote, savedRecipe } from '#/db/schema'

export function findRecipeContent(recipeId: string) {
  // Separate relational branches aggregate each collection before combining them.
  // A flat join of ingredients, instructions, and tags would multiply their rows.
  return db.query.recipe.findFirst({
    where: (row, operators) =>
      operators.and(
        operators.eq(row.id, recipeId),
        operators.isNull(row.deletedAt),
      ),
    with: {
      ingredients: {
        columns: { recipeId: false },
        orderBy: (row, { asc }) => [asc(row.sortOrder), asc(row.id)],
      },
      instructions: {
        columns: { recipeId: false },
        orderBy: (row, { asc }) => [asc(row.sortOrder), asc(row.id)],
        with: {
          ingredientUsages: {
            columns: { ingredientId: true, quantityUsed: true },
            orderBy: (row, { asc }) => asc(row.ingredientId),
          },
        },
      },
      courses: {
        columns: {},
        orderBy: (row, { asc }) => asc(row.courseId),
        with: { course: true },
      },
      cuisines: {
        columns: {},
        orderBy: (row, { asc }) => asc(row.cuisineId),
        with: { cuisine: true },
      },
      dietaryPreferences: {
        columns: {},
        orderBy: (row, { asc }) => asc(row.dietaryPreferenceId),
        with: { dietaryPreference: true },
      },
      discoveryTags: {
        columns: {},
        orderBy: (row, { asc }) => asc(row.discoveryTagId),
        with: { discoveryTag: true },
      },
      customTags: {
        columns: {},
        orderBy: (row, { asc }) => asc(row.customTagId),
        with: { customTag: true },
      },
      fork: {
        columns: {},
        with: {
          parentRecipe: {
            columns: {
              id: true,
              title: true,
              authorId: true,
              visibility: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      },
    },
  })
}

export async function findRecipeViewerState(
  recipeId: string,
  viewerId: string,
) {
  // Personal state changes independently of authored content and must never be
  // included in a recipe cache shared between viewers. Each join matches at most one row.
  const rows = await db
    .select({
      savedRecipeId: savedRecipe.recipeId,
      madeRecipeId: madeThis.recipeId,
      personalNote: recipePersonalNote.note,
    })
    .from(recipe)
    .leftJoin(
      savedRecipe,
      and(
        eq(savedRecipe.recipeId, recipe.id),
        eq(savedRecipe.userId, viewerId),
      ),
    )
    .leftJoin(
      madeThis,
      and(eq(madeThis.recipeId, recipe.id), eq(madeThis.userId, viewerId)),
    )
    .leftJoin(
      recipePersonalNote,
      and(
        eq(recipePersonalNote.recipeId, recipe.id),
        eq(recipePersonalNote.userId, viewerId),
      ),
    )
    .where(eq(recipe.id, recipeId))

  const row = rows.at(0)
  if (!row) return null

  return {
    isSaved: row.savedRecipeId !== null,
    hasMade: row.madeRecipeId !== null,
    personalNote: row.personalNote,
  }
}
