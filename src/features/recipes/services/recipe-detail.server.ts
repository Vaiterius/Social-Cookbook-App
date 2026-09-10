import {
  findRecipeContent,
  findRecipeViewerState,
} from '../repositories/recipe-detail.server'
import type { recipe } from '#/db/schema'

type RecipeAccess = Pick<
  typeof recipe.$inferSelect,
  'authorId' | 'visibility' | 'status' | 'deletedAt'
>

function canReadRecipe(value: RecipeAccess, viewerId: string | null) {
  return (
    value.deletedAt === null &&
    (value.authorId === viewerId ||
      (value.visibility === 'public' && value.status === 'published'))
  )
}

export async function getRecipeDetail(
  recipeId: string,
  viewerId: string | null = null,
) {
  const content = await findRecipeContent(recipeId)

  // Missing and inaccessible recipes have the same result so callers cannot
  // distinguish a private recipe from an ID that does not exist.
  if (!content || !canReadRecipe(content, viewerId)) return null

  // Drizzle infers this relation as required from recipe.id, but the fork row is optional.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const parent = content.fork?.parentRecipe

  return {
    recipe: {
      id: content.id,
      authorId: content.authorId,
      title: content.title,
      caption: content.caption,
      coverImageKey: content.coverImageKey,
      prepTimeMinutes: content.prepTimeMinutes,
      cookTimeMinutes: content.cookTimeMinutes,
      servings: content.servings,
      difficulty: content.difficulty,
      authorsNote: content.authorsNote,
      calories: content.calories,
      proteinGrams: content.proteinGrams,
      carbsGrams: content.carbsGrams,
      fatGrams: content.fatGrams,
      fiberGrams: content.fiberGrams,
      visibility: content.visibility,
      status: content.status,
      sourceName: content.sourceName,
      sourceURL: content.sourceURL,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      ingredients: content.ingredients,
      instructions: content.instructions,
      courses: content.courses.map(({ course }) => course),
      cuisines: content.cuisines.map(({ cuisine }) => cuisine),
      dietaryPreferences: content.dietaryPreferences.map(
        ({ dietaryPreference }) => dietaryPreference,
      ),
      discoveryTags: content.discoveryTags.map(
        ({ discoveryTag }) => discoveryTag,
      ),
      customTags: content.customTags.map(({ customTag }) => customTag),
      // Publishing a fork does not make its parent public. Check the source
      // independently before exposing its title or a navigable ID.
      parentRecipe:
        parent && canReadRecipe(parent, viewerId)
          ? { id: parent.id, title: parent.title }
          : null,
    },
    viewerState: viewerId
      ? await findRecipeViewerState(recipeId, viewerId)
      : null,
  }
}
