import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { eq, inArray } from 'drizzle-orm'
import { activityTimeLabel } from '../src/features/activity/components/ActivityCard'
import * as schema from '../src/db/schema'

config({ path: ['.env.local', '.env'], quiet: true })
assert(process.env.DATABASE_URL, 'DATABASE_URL is required')
const target = new URL(process.env.DATABASE_URL)
assert(
  process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) &&
    target.pathname === '/sapori_dev',
  'Run this check only against local sapori_dev',
)

const { db } = await import('../src/db')
const { findPublicRecipeActivities } =
  await import('../src/features/activity/repositories/following-feed.server')
const rollback = new Error('Rollback feed test data')

try {
  await db.transaction(async (tx) => {
    const [author, actor, deletedUser] = await tx
      .insert(schema.user)
      .values(
        ['Author', 'Actor', 'Deleted'].map((name) => ({
          name,
          firstName: name,
          lastName: 'Feed test',
          email: `${randomUUID()}@example.test`,
          deletedAt: name === 'Deleted' ? new Date() : null,
        })),
      )
      .returning()
    const recipes = await tx
      .insert(schema.recipe)
      .values(
        Array.from({ length: 7 }, (_, index) => ({
          authorId: index === 5 ? deletedUser.id : author.id,
          title: `Feed check ${index}`,
          caption: 'Test caption',
          coverImageKey: 'test/cover.jpg',
          prepTimeMinutes: 0,
          cookTimeMinutes: 10,
          servings: 1,
          difficulty: 'easy' as const,
          authorsNote: 'Test note',
          calories: 100,
          proteinGrams: 5,
          carbsGrams: 15,
          fatGrams: 2,
          fiberGrams: 1,
          sourceName: 'Test source',
          sourceURL: 'https://example.test/recipe',
          visibility: index === 2 ? ('private' as const) : ('public' as const),
          status: index === 3 ? ('draft' as const) : ('published' as const),
          deletedAt: index === 4 ? new Date() : null,
        })),
      )
      .returning()
    const publishedAt = new Date('2026-01-01T12:00:00Z')
    const events = await tx
      .insert(schema.activity)
      .values([
        ...recipes.map((recipe, index) => ({
          actorId: index === 6 ? deletedUser.id : actor.id,
          recipeId: recipe.id,
          type: 'recipe_published' as const,
          createdAt: publishedAt,
        })),
        {
          actorId: actor.id,
          recipeId: recipes[0].id,
          type: 'made_this' as const,
        },
        { actorId: actor.id, type: 'cookbook_published' as const },
        { actorId: actor.id, type: 'recipe_published' as const },
        {
          actorId: actor.id,
          recipeId: recipes[0].id,
          type: 'recipe_published' as const,
          createdAt: new Date('2025-01-01T12:00:00Z'),
        },
      ])
      .returning()
    const eventIds = new Set(events.map(({ id }) => id))
    const feed = (await findPublicRecipeActivities(tx)).filter(({ id }) =>
      eventIds.has(id),
    )
    assert.deepEqual(
      feed.map(({ id }) => id),
      [
        ...events
          .slice(0, 2)
          .map(({ id }) => id)
          .sort()
          .reverse(),
        events[10].id,
      ],
    )
    assert.deepEqual(feed[0].actor, {
      id: actor.id,
      name: actor.name,
      image: null,
    })
    assert.deepEqual(feed[0].author, { id: author.id, name: author.name })
    assert.equal(feed[0].recipe.prepTimeMinutes, 0)

    // Historical publication events must disappear when current access changes.
    await tx
      .update(schema.recipe)
      .set({ visibility: 'private' })
      .where(
        inArray(
          schema.recipe.id,
          recipes.slice(0, 2).map(({ id }) => id),
        ),
      )
    assert.equal(
      (await findPublicRecipeActivities(tx)).filter(({ id }) =>
        eventIds.has(id),
      ).length,
      0,
    )
    await tx
      .update(schema.recipe)
      .set({ visibility: 'public', deletedAt: new Date() })
      .where(eq(schema.recipe.id, recipes[0].id))
    assert.equal(
      (await findPublicRecipeActivities(tx)).filter(({ id }) =>
        eventIds.has(id),
      ).length,
      0,
    )
    throw rollback
  })
} catch (error) {
  if (error !== rollback) throw error
} finally {
  await db.$client.end()
}

const asOf = new Date('2026-01-02T12:00:00Z')
for (const [seconds, expected] of [
  [0, 'now'],
  [30, '30 seconds ago'],
  [60, '1 minute ago'],
  [3600, '1 hour ago'],
  [86400, 'yesterday'],
  [-60, 'now'],
] as const) {
  assert.equal(
    activityTimeLabel(new Date(asOf.getTime() - seconds * 1000), asOf),
    expected,
  )
}
console.log('Following feed checks passed; test database rows rolled back.')
