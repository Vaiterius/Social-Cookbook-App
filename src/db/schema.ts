import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
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

/*
 * Soft deletion is parent-owned: deletedAt is null while a row is active.
 * Application workflows must soft-delete a user's authored recipes/cookbooks
 * on account deletion and hide dependent data through its deleted parent.
 * Keep recipe fork connections for lineage, even when a recipe is deleted.
 * Explicit ingredient, instruction, and association removals use hard deletes.
 */

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
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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

export const recipe = pgTable(
  'recipe',
  {
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
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    // Drafts may be incomplete; enforce publication completeness for every writer.
    // deletedAt is lifecycle metadata and must remain nullable for active recipes.
    check(
      'recipe_published_fields_required',
      sql`${table.status} = 'draft' or (
          ${table.title} is not null
          and ${table.caption} is not null
          and ${table.coverImageKey} is not null
          and ${table.prepTimeMinutes} is not null
          and ${table.cookTimeMinutes} is not null
          and ${table.servings} is not null
          and ${table.difficulty} is not null
          and ${table.authorsNote} is not null
          and ${table.calories} is not null
          and ${table.proteinGrams} is not null
          and ${table.carbsGrams} is not null
          and ${table.fatGrams} is not null
          and ${table.fiberGrams} is not null
          and ${table.sourceName} is not null
          and ${table.sourceURL} is not null
      )`,
    ),
  ],
)

/* RECIPE INGREDIENT MODEL */
export const recipeIngredient = pgTable(
  'recipe_ingredient',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    name: text('name').notNull(),
    quantity: numeric('quantity'),
    unit: text('unit'),
    sortOrder: integer('sort_order').notNull(),
  },
  (table) => [
    // Recipe detail reads filter by recipe first, then walk ingredients in display order.
    index('recipe_ingredient_recipe_sort_idx').on(
      table.recipeId,
      table.sortOrder,
    ),
  ],
)

/* COURSE MODEL */
export const course = pgTable(
  'course',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
  },
  (table) => [
    check('course_name_lowercase', sql`${table.name} = lower(${table.name})`),
  ],
)

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
export const cuisine = pgTable(
  'cuisine',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
  },
  (table) => [
    check('cuisine_name_lowercase', sql`${table.name} = lower(${table.name})`),
  ],
)

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
export const dietaryPreference = pgTable(
  'dietary_preference',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
  },
  (table) => [
    check(
      'dietary_preference_name_lowercase',
      sql`${table.name} = lower(${table.name})`,
    ),
  ],
)

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
export const discoveryTag = pgTable(
  'discovery_tag',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull().unique(),
  },
  (table) => [
    check(
      'discovery_tag_name_lowercase',
      sql`${table.name} = lower(${table.name})`,
    ),
  ],
)

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
export const recipeInstruction = pgTable(
  'recipe_instruction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    sortOrder: integer('sort_order').notNull(),
    text: varchar('text', { length: 500 }).notNull(),
    imageKey: text('image_key'),
  },
  (table) => [
    index('recipe_instruction_recipe_sort_idx').on(
      table.recipeId,
      table.sortOrder,
    ),
  ],
)

/* RECIPE INSTRUCTION INGREDIENT MODEL */
export const recipeInstructionIngredient = pgTable(
  'recipe_instruction_ingredient',
  {
    instructionId: uuid('instruction_id')
      .notNull()
      .references(() => recipeInstruction.id),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => recipeIngredient.id),
    quantityUsed: numeric('quantity_used'),
  },
  (table) => [
    primaryKey({ columns: [table.instructionId, table.ingredientId] }),
  ],
)

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
export const cookbookStatus = pgEnum('cookbook_status', ['draft', 'published'])

export const cookbook = pgTable('cookbook', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id),
  title: text('title').notNull(),
  caption: text('caption'),
  coverImageKey: text('cover_image_key'),
  visibility: cookbookVisibility('visibility').notNull(),
  status: cookbookStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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

/* SAVED COOKBOOK MODEL */
export const savedCookbook = pgTable(
  'saved_cookbook',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    cookbookId: uuid('cookbook_id')
      .notNull()
      .references(() => cookbook.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cookbookId] })],
)

/* RECIPE PERSONAL NOTE MODEL */
export const recipePersonalNote = pgTable(
  'recipe_personal_note',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipe.id),
    note: varchar('note', { length: 200 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.recipeId] })],
)

/* ACTIVITY MODEL */
export const activityType = pgEnum('activity_type', [
  'recipe_published',
  'cookbook_published',
  'recipe_forked',
  'recipe_added_to_cookbook',
  'made_this',
])

export const activity = pgTable('activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id')
    .notNull()
    .references(() => user.id),
  type: activityType('type').notNull(),
  recipeId: uuid('recipe_id').references(() => recipe.id),
  cookbookId: uuid('cookbook_id').references(() => cookbook.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

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
