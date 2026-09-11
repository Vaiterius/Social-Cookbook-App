import assert from 'node:assert/strict'
import { config } from 'dotenv'
import { eq, getTableColumns, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../src/db/schema'
import * as relations from '../src/db/relations'
import { recipeSlug } from '../src/features/recipes/recipe-slug'

config({ path: ['.env.local', '.env'], quiet: true })
assert(process.env.DATABASE_URL, 'DATABASE_URL is required')
const target = new URL(process.env.DATABASE_URL)
assert(
  process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) &&
    target.pathname === '/sapori_dev',
  'This seed only supports the local sapori_dev database',
)
assert(
  process.argv.slice(2).every((arg) => arg === '--clear'),
  'Usage: npm run db:seed [-- --clear]',
)
const clearOnly = process.argv.includes('--clear')

// Reserved fixture IDs keep bookmarked URLs stable and cleanup narrowly scoped.
const userIds = [1, 2, 3].map(
  (id) => `5eed0000-0000-4000-8000-${String(id).padStart(12, '0')}`,
)
const recipeIds = [1, 2, 3, 4, 5].map(
  (id) => `5eed0000-0000-4000-8001-${String(id).padStart(12, '0')}`,
)
const customTagId = '5eed0000-0000-4000-8002-000000000001'
const recipes = [
  {
    id: recipeIds[0],
    authorId: userIds[0],
    title: 'Spicy Chicken Adobo',
    caption: 'A tangy, peppery family dinner with plenty of sauce.',
    coverImageKey: 'seed/adobo-cover.jpg',
    prepTimeMinutes: 15,
    cookTimeMinutes: 40,
    servings: 4,
    difficulty: 'medium',
    authorsNote: 'Let the vinegar simmer before stirring.',
    calories: 420,
    proteinGrams: 32,
    carbsGrams: 12,
    fatGrams: 27,
    fiberGrams: 1,
    sourceName: 'Maya’s family recipe',
    sourceURL: 'https://example.com/recipes/adobo',
    visibility: 'public',
    status: 'published',
  },
  {
    id: recipeIds[1],
    authorId: userIds[1],
    title: 'Mushroom Adobo',
    caption: 'A meat-free variation of Maya’s adobo.',
    coverImageKey: 'seed/mushroom-adobo-cover.jpg',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: 'easy',
    authorsNote: 'Brown the mushrooms before adding the sauce.',
    calories: 180,
    proteinGrams: 8,
    carbsGrams: 16,
    fatGrams: 10,
    fiberGrams: 4,
    sourceName: 'Maya’s chicken adobo',
    sourceURL: 'https://example.com/recipes/adobo',
    visibility: 'public',
    status: 'published',
  },
  {
    id: recipeIds[2],
    authorId: userIds[2],
    title: 'Simple Toast',
    caption: 'Crisp toast for a simple breakfast.',
    coverImageKey: 'seed/toast-cover.jpg',
    prepTimeMinutes: 0,
    cookTimeMinutes: 3,
    servings: 1,
    difficulty: 'easy',
    authorsNote: 'Serve immediately while warm.',
    calories: 160,
    proteinGrams: 6,
    carbsGrams: 28,
    fatGrams: 2,
    fiberGrams: 4,
    sourceName: 'Sam’s kitchen',
    sourceURL: 'https://example.com/recipes/toast',
    visibility: 'public',
    status: 'published',
  },
  {
    id: recipeIds[3],
    authorId: userIds[0],
    title: 'Private Family Soup',
    caption: 'A warming vegetable soup from Maya’s kitchen.',
    coverImageKey: 'seed/soup-cover.jpg',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: 'easy',
    authorsNote: 'Cut the vegetables evenly so they cook together.',
    calories: 150,
    proteinGrams: 5,
    carbsGrams: 22,
    fatGrams: 5,
    fiberGrams: 6,
    sourceName: 'Maya’s family recipe',
    sourceURL: 'https://example.com/recipes/soup',
    visibility: 'private',
    status: 'published',
  },
  {
    id: recipeIds[4],
    authorId: userIds[1],
    title: 'Unfinished Pancakes',
    visibility: 'public',
    status: 'draft',
  },
] satisfies (typeof schema.recipe.$inferInsert)[]

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema: { ...schema, ...relations } })

try {
  // Replacement is atomic: a failed insert restores the previous fixtures.
  await db.transaction(async (tx) => {
    const instructions = tx
      .select({ id: schema.recipeInstruction.id })
      .from(schema.recipeInstruction)
      .where(inArray(schema.recipeInstruction.recipeId, recipeIds))
    await tx
      .delete(schema.recipeInstructionIngredient)
      .where(
        inArray(schema.recipeInstructionIngredient.instructionId, instructions),
      )
    for (const table of [
      schema.recipeInstruction,
      schema.recipeIngredient,
      schema.recipeCourse,
      schema.recipeCuisine,
      schema.recipeDietaryPreference,
      schema.recipeDiscoveryTag,
      schema.recipeCustomTag,
      schema.savedRecipe,
      schema.madeThis,
      schema.recipePersonalNote,
      schema.activity,
    ]) {
      await tx.delete(table).where(inArray(table.recipeId, recipeIds))
    }
    await tx
      .delete(schema.recipeFork)
      .where(inArray(schema.recipeFork.childRecipeId, recipeIds))
    await tx.delete(schema.recipe).where(inArray(schema.recipe.id, recipeIds))
    await tx
      .delete(schema.customTag)
      .where(eq(schema.customTag.id, customTagId))
    // Unexpected references from other data intentionally fail instead of cascading.
    await tx.delete(schema.user).where(inArray(schema.user.id, userIds))

    if (clearOnly) {
      assert.equal(
        (
          await tx
            .select()
            .from(schema.recipe)
            .where(inArray(schema.recipe.id, recipeIds))
        ).length,
        0,
      )
      return
    }

    await tx.insert(schema.user).values(
      ['Maya Santos', 'Leo Rivera', 'Sam Chen'].map((name, index) => ({
        id: userIds[index],
        name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        email: `seed.${name.split(' ')[0].toLowerCase()}@example.test`,
        bio: 'Local recipe-detail testing fixture.',
      })),
    )
    await tx.insert(schema.recipe).values(recipes)
    // Publication events are separate rows; recipe status alone cannot populate the feed.
    // Include the private publication to exercise the feed's visibility check.
    await tx.insert(schema.activity).values(
      recipes
        .filter((recipe) => recipe.status === 'published')
        .map((recipe) => ({
          actorId: recipe.authorId,
          recipeId: recipe.id,
          type: 'recipe_published' as const,
        })),
    )
    const publications = await tx
      .select({ recipeId: schema.activity.recipeId })
      .from(schema.activity)
      .where(inArray(schema.activity.recipeId, recipeIds))
    assert.deepEqual(
      publications.map(({ recipeId }) => recipeId).sort(),
      recipeIds.slice(0, 4).sort(),
    )

    // Savepoints let expected database rejections leave the seed transaction usable.
    const publicationError = (error: unknown) => {
      const cause = error instanceof Error ? error.cause : undefined
      return (
        cause instanceof Error &&
        'code' in cause &&
        cause.code === '23514' &&
        'constraint' in cause &&
        cause.constraint === 'recipe_published_fields_required'
      )
    }
    await assert.rejects(
      tx.transaction(async (savepoint) => {
        await savepoint.insert(schema.recipe).values({
          authorId: userIds[0],
          visibility: 'public',
          status: 'published',
        })
      }),
      publicationError,
    )
    for (const [field, column] of Object.entries(
      getTableColumns(schema.recipe),
    )) {
      if (column.notNull || field === 'deletedAt') continue
      await assert.rejects(
        tx.transaction(async (savepoint) => {
          await savepoint
            .update(schema.recipe)
            .set({ [field]: null })
            .where(eq(schema.recipe.id, recipeIds[0]))
        }),
        publicationError,
      )
    }
    await assert.rejects(
      tx.transaction(async (savepoint) => {
        await savepoint
          .update(schema.recipe)
          .set({ status: 'published' })
          .where(eq(schema.recipe.id, recipeIds[4]))
      }),
      publicationError,
    )

    for (const [index, mainIngredient] of [
      'Chicken thighs',
      'Mushrooms',
    ].entries()) {
      // Insert out of display order to exercise the detail query's ordering.
      const ingredients = await tx
        .insert(schema.recipeIngredient)
        .values([
          {
            recipeId: recipeIds[index],
            name: 'Soy sauce',
            quantity: '0.25',
            unit: 'cup',
            sortOrder: 2,
          },
          {
            recipeId: recipeIds[index],
            name: mainIngredient,
            quantity: '500',
            unit: 'g',
            sortOrder: 1,
          },
          { recipeId: recipeIds[index], name: 'Black pepper', sortOrder: 3 },
        ])
        .returning()
      const steps = await tx
        .insert(schema.recipeInstruction)
        .values([
          {
            recipeId: recipeIds[index],
            text: 'Simmer until tender and season with pepper.',
            sortOrder: 2,
          },
          {
            recipeId: recipeIds[index],
            text: 'Combine the main ingredient and soy sauce in a pot.',
            imageKey: 'seed/adobo-step.jpg',
            sortOrder: 1,
          },
        ])
        .returning()
      await tx.insert(schema.recipeInstructionIngredient).values([
        {
          instructionId: steps[1].id,
          ingredientId: ingredients[0].id,
          quantityUsed: '0.25',
        },
        {
          instructionId: steps[1].id,
          ingredientId: ingredients[1].id,
          quantityUsed: '500',
        },
        { instructionId: steps[0].id, ingredientId: ingredients[2].id },
      ])
    }

    const course = (
      await tx
        .select()
        .from(schema.course)
        .where(eq(schema.course.name, 'dinner'))
    ).at(0)
    const cuisine = (
      await tx
        .select()
        .from(schema.cuisine)
        .where(eq(schema.cuisine.name, 'filipino'))
    ).at(0)
    const diet = (
      await tx
        .select()
        .from(schema.dietaryPreference)
        .where(eq(schema.dietaryPreference.name, 'vegetarian'))
    ).at(0)
    const tag = (
      await tx
        .select()
        .from(schema.discoveryTag)
        .where(eq(schema.discoveryTag.name, 'comfort food'))
    ).at(0)
    assert(
      course && cuisine && diet && tag,
      'Required taxonomy is missing. Run npm run db:seed:taxonomy first.',
    )
    await tx
      .insert(schema.recipeCourse)
      .values(
        recipeIds
          .slice(0, 2)
          .map((recipeId) => ({ recipeId, courseId: course.id })),
      )
    await tx
      .insert(schema.recipeCuisine)
      .values(
        recipeIds
          .slice(0, 2)
          .map((recipeId) => ({ recipeId, cuisineId: cuisine.id })),
      )
    await tx
      .insert(schema.recipeDietaryPreference)
      .values({ recipeId: recipeIds[1], dietaryPreferenceId: diet.id })
    await tx
      .insert(schema.recipeDiscoveryTag)
      .values({ recipeId: recipeIds[0], discoveryTagId: tag.id })
    await tx
      .insert(schema.customTag)
      .values({ id: customTagId, name: 'seed-family-favorite' })
    await tx
      .insert(schema.recipeCustomTag)
      .values({ recipeId: recipeIds[0], customTagId })
    await tx.insert(schema.recipeFork).values({
      childRecipeId: recipeIds[1],
      parentRecipeId: recipeIds[0],
      note: 'Swap chicken for mushrooms.',
    })
    await tx
      .insert(schema.savedRecipe)
      .values({ userId: userIds[1], recipeId: recipeIds[0] })
    await tx
      .insert(schema.madeThis)
      .values({ userId: userIds[1], recipeId: recipeIds[0] })
    await tx.insert(schema.recipePersonalNote).values({
      userId: userIds[1],
      recipeId: recipeIds[0],
      note: 'Use less soy sauce next time.',
    })

    // A runnable smoke check catches missing fixtures and broken nested relations.
    const detail = await tx.query.recipe.findFirst({
      where: eq(schema.recipe.id, recipeIds[0]),
      with: {
        ingredients: { orderBy: (row, { asc }) => asc(row.sortOrder) },
        instructions: { with: { ingredientUsages: true } },
      },
    })
    assert.equal(detail?.ingredients[0].name, 'Chicken thighs')
    assert.equal(
      detail.instructions.flatMap((step) => step.ingredientUsages).length,
      3,
    )
    assert.equal(
      (
        await tx
          .select()
          .from(schema.recipe)
          .where(inArray(schema.recipe.id, recipeIds))
      ).length,
      5,
    )
  })

  console.log(
    clearOnly
      ? 'Seed users, recipes, and activities deleted.'
      : 'Seeded 3 users, 5 recipes, and 4 publication activities. Smoke check passed.',
  )
  if (!clearOnly) {
    for (const recipe of recipes) {
      console.log(
        `${recipe.title} (${recipe.visibility}, ${recipe.status}): http://localhost:3000/recipes/${recipe.id}/${recipeSlug(recipe.title)}`,
      )
    }
  }
} finally {
  await pool.end()
}
