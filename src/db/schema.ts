import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

/* USER MODEL */
export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  avatarImageKey: text('avatar_image_key'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

/* RECIPE MODEL */
export const recipeDifficulty = pgEnum('recipe_difficulty', [
  'easy',
  'medium',
  'hard',
])
export const recipeVisibility = pgEnum('recipe_visibility', [
  'public',
  'private',
])
export const recipeStatus = pgEnum('recipe_status', ['draft', 'published'])

export const recipe = pgTable('recipe', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id),
  title: varchar('title', { length: 100 }),
  caption: varchar('caption', { length: 250 }),
  coverImageKey: text('cover_image_key'),
  prepTimeMinutes: integer('prep_time_minutes'),
  cookTimeMinutes: integer('cook_time_minutes'),
  servings: integer('servings'),
  difficulty: recipeDifficulty('difficulty'),
  authorsNote: varchar('authors_note', { length: 250 }),
  calories: integer('calories'),
  proteinGrams: integer('protein_grams'),
  carbsGrams: integer('carbs_grams'),
  fatGrams: integer('fat_grams'),
  fiberGrams: integer('fiber_grams'),
  visibility: recipeVisibility('visibility').notNull(),
  status: recipeStatus('status').notNull(),
  sourceName: text('source_name'),
  sourceURL: text('source_url'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

/* RECIPE INGREDIENT MODEL */
export const recipeIngredient = pgTable('recipe_ingredient', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id')
    .notNull()
    .references(() => recipe.id),
  name: text('name').notNull(),
  quantity: numeric('quantity'),
  unit: text('unit'),
  sortOrder: integer('sort_order').notNull(),
})

/* COURSE MODEL */
export const course = pgTable('course', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
})

/* RECIPE COURSE MODEL */
export const recipeCourse = pgTable(
  'recipe_course',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    courseId: integer('course_id')
      .notNull()
      .references(() => course.id),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.courseId] })],
)

/* CUISINE MODEL */
export const cuisine = pgTable('cuisine', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
})

/* RECIPE CUISINE MODEL */
export const recipeCuisine = pgTable(
  'recipe_cuisine',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    cuisineId: integer('cuisine_id')
      .notNull()
      .references(() => cuisine.id),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.cuisineId] })],
)

/* DIETARY PREFERENCE MODEL */
export const dietaryPreference = pgTable('dietary_preference', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
})

/* RECIPE DIETARY PREFERENCE MODEL */
export const recipeDietaryPreference = pgTable(
  'recipe_dietary_preference',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    dietaryPreferenceId: integer('dietary_preference_id')
      .notNull()
      .references(() => dietaryPreference.id),
  },
  (table) => [
    primaryKey({ columns: [table.recipeId, table.dietaryPreferenceId] }),
  ],
)

/* DISCOVERY TAG MODEL */
export const discoveryTag = pgTable('discovery_tag', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
})

/* RECIPE DISCOVERY TAG MODEL */
export const recipeDiscoveryTag = pgTable(
  'recipe_discovery_tag',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    discoveryTagId: integer('discovery_tag_id')
      .notNull()
      .references(() => discoveryTag.id),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.discoveryTagId] })],
)

/* RECIPE INSTRUCTION MODEL */
export const recipeInstruction = pgTable('recipe_instruction', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id')
    .notNull()
    .references(() => recipe.id),
  sortOrder: integer('sort_order').notNull(),
  text: varchar('text', { length: 500 }).notNull(),
  imageKey: text('image_key'),
})

/* CUSTOM TAG MODEL */
export const customTag = pgTable(
  'custom_tag',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
  },
  (table) => [
    check(
      'custom_tag_name_lowercase',
      sql`${table.name} = lower(${table.name})`,
    ),
  ],
)

/* RECIPE CUSTOM TAG MODEL */
export const recipeCustomTag = pgTable(
  'recipe_custom_tag',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    customTagId: uuid('custom_tag_id')
      .notNull()
      .references(() => customTag.id),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.customTagId] })],
)

/* COOKBOOK MODEL */
export const cookbookVisibility = pgEnum('cookbook_visibility', [
  'public',
  'private',
])

export const cookbook = pgTable('cookbook', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id),
  title: text('title').notNull(),
  caption: text('caption'),
  coverImageKey: text('cover_image_key'),
  visibility: cookbookVisibility('visibility').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

/* COOKBOOK RECIPE MODEL */
export const cookbookRecipe = pgTable(
  'cookbook_recipe',
  {
    cookbookId: uuid('cookbook_id')
      .notNull()
      .references(() => cookbook.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    sortOrder: integer('sort_order').notNull(),
    addedAt: timestamp('added_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.cookbookId, table.recipeId] })],
)

/* RECIPE FORK MODEL */
export const recipeFork = pgTable(
  'recipe_fork',
  {
    childRecipeId: uuid('child_recipe_id')
      .primaryKey()
      .references(() => recipe.id),
    parentRecipeId: uuid('parent_recipe_id')
      .notNull()
      .references(() => recipe.id),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      'recipe_fork_no_self_reference',
      sql`${table.childRecipeId} <> ${table.parentRecipeId}`,
    ),
  ],
)

/* SAVED RECIPE MODEL */
export const savedRecipe = pgTable(
  'saved_recipe',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.recipeId] })],
)

/* MADE THIS MODEL */
export const madeThis = pgTable(
  'made_this',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.recipeId] })],
)

/* FOLLOW MODEL */
export const follow = pgTable(
  'follow',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => user.id),
    followingId: uuid('following_id')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    check(
      'follow_no_self_reference',
      sql`${table.followerId} <> ${table.followingId}`,
    ),
  ],
)
