import assert from 'node:assert/strict'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../src/db/schema'

// Match Drizzle's environment selection so migrations and taxonomy use the same target.
const envFile = process.env.DB_ENV_FILE
const result = config({ path: envFile ?? ['.env.local', '.env'], quiet: true })
if (envFile && result.error) {
  throw new Error(`Unable to load DB_ENV_FILE: ${envFile}`)
}
assert(process.env.DATABASE_URL?.trim(), 'DATABASE_URL is required')
assert.equal(process.argv.length, 2, 'Usage: npm run db:seed:taxonomy')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

try {
  await db.transaction(async (tx) => {
    // Taxonomy is shared data: reuse names and retain it when fixtures are cleared.
    await tx
      .insert(schema.course)
      .values(
        [
          'Dinner',
          'Breakfast',
          'Appetizer',
          'Main course',
          'Side dish',
          'Soup',
          'Dessert',
          'Snack',
        ].map((name) => ({ name: name.toLowerCase() })),
      )
      .onConflictDoNothing()
    await tx
      .insert(schema.cuisine)
      .values(
        [
          'American',
          'Chinese',
          'French',
          'Italian',
          'Greek',
          'Indian',
          'Japanese',
          'Korean',
          'Mediterranean',
          'Mexican',
          'Thai',
          'Middle Eastern',
          'Filipino',
          'Vietnamese',
        ].map((name) => ({ name: name.toLowerCase() })),
      )
      .onConflictDoNothing()
    await tx
      .insert(schema.dietaryPreference)
      .values(
        [
          'Vegetarian',
          'Vegan',
          'Pescatarian',
          'Gluten-free',
          'Dairy-free',
          'Nut-free',
          'Egg-free',
          'Low carb',
          'Keto',
          'Paleo',
          'Halal',
          'Kosher',
        ].map((name) => ({ name: name.toLowerCase() })),
      )
      .onConflictDoNothing()
    await tx
      .insert(schema.discoveryTag)
      .values(
        [
          'Quick & easy',
          'One-pot',
          'Meal prep',
          'Budget friendly',
          'Comfort food',
          'Healthy',
          'High-protein',
          'No-cook',
          'Air fryer',
          'Date night',
          'Weeknight',
          'Crowd pleasers',
        ].map((name) => ({ name: name.toLowerCase() })),
      )
      .onConflictDoNothing()
    // Verify the stored representation as well as repeatable seed inserts.
    for (const table of [
      schema.course,
      schema.cuisine,
      schema.dietaryPreference,
      schema.discoveryTag,
    ]) {
      const rows = await tx.select({ name: table.name }).from(table)
      assert(rows.every(({ name }) => name === name.toLowerCase()))
      assert.equal(new Set(rows.map(({ name }) => name)).size, rows.length)
    }
  })
  console.log(
    'Seeded courses, cuisines, dietary preferences, and discovery tags.',
  )
} finally {
  await pool.end()
}
