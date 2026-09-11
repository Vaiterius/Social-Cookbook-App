import { and, desc, eq, isNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { db } from '#/db'
import { activity, recipe, user } from '#/db/schema'

export function findPublicRecipeActivities(
  database: Pick<typeof db, 'select'> = db,
) {
  const author = alias(user, 'author')

  return (
    database
      .select({
        id: activity.id,
        type: activity.type,
        createdAt: activity.createdAt,
        actor: { id: user.id, name: user.name, image: user.image },
        author: { id: author.id, name: author.name },
        recipe: {
          id: recipe.id,
          title: recipe.title,
          caption: recipe.caption,
          coverImageKey: recipe.coverImageKey,
          difficulty: recipe.difficulty,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
        },
      })
      .from(activity)
      .innerJoin(recipe, eq(activity.recipeId, recipe.id))
      .innerJoin(user, eq(activity.actorId, user.id))
      .innerJoin(author, eq(recipe.authorId, author.id))
      // Check current visibility, not visibility at publication time.
      .where(
        and(
          eq(activity.type, 'recipe_published'),
          eq(recipe.visibility, 'public'),
          eq(recipe.status, 'published'),
          isNull(recipe.deletedAt),
          isNull(user.deletedAt),
          isNull(author.deletedAt),
        ),
      )
      // ponytail: unbounded local feed; add cursor pagination before a large dataset.
      .orderBy(desc(activity.createdAt), desc(activity.id))
  )
}
