import {
  Link,
  createFileRoute,
  notFound,
  redirect,
} from '@tanstack/react-router'
import { fetchRecipeDetail } from '#/features/recipes/functions/recipe-detail.functions'
import { recipeSlug } from '#/features/recipes/recipe-slug'
import { isUuid } from '#/features/recipes/validation/recipe-detail'

export const Route = createFileRoute('/_app/recipes/$recipeId/$slug')({
  loader: async ({ params }) => {
    if (!isUuid(params.recipeId)) throw notFound()

    const detail = await fetchRecipeDetail({
      data: { recipeId: params.recipeId },
    })
    if (!detail) throw notFound()

    // Resolve and authorize by ID first: title edits keep old links working,
    // and a redirect must not disclose an inaccessible recipe's current title.
    const slug = recipeSlug(detail.recipe.title)
    if (params.slug !== slug) {
      throw redirect({
        to: '/recipes/$recipeId/$slug',
        params: { recipeId: detail.recipe.id, slug },
        replace: true,
      })
    }

    return detail
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  pendingComponent: () => <p>Loading recipe...</p>,
  notFoundComponent: () => <p>Recipe not found.</p>,
  errorComponent: () => <p>Unable to load recipe.</p>,
  component: RecipeDetailPage,
})

function RecipeDetailPage() {
  const { recipe, viewerState } = Route.useLoaderData()
  const fields = {
    Title: recipe.title,
    'Recipe ID': recipe.id,
    'Author ID': recipe.authorId,
    Caption: recipe.caption,
    'Cover image key': recipe.coverImageKey,
    'Prep time (minutes)': recipe.prepTimeMinutes,
    'Cook time (minutes)': recipe.cookTimeMinutes,
    Servings: recipe.servings,
    Difficulty: recipe.difficulty,
    "Author's note": recipe.authorsNote,
    Calories: recipe.calories,
    'Protein (grams)': recipe.proteinGrams,
    'Carbs (grams)': recipe.carbsGrams,
    'Fat (grams)': recipe.fatGrams,
    'Fiber (grams)': recipe.fiberGrams,
    Visibility: recipe.visibility,
    Status: recipe.status,
    'Source name': recipe.sourceName,
    'Source URL': recipe.sourceURL,
    'Created at': recipe.createdAt.toISOString(),
    'Updated at': recipe.updatedAt.toISOString(),
    Courses: recipe.courses.map(({ name }) => name).join(', '),
    Cuisines: recipe.cuisines.map(({ name }) => name).join(', '),
    'Dietary preferences': recipe.dietaryPreferences
      .map(({ name }) => name)
      .join(', '),
    'Discovery tags': recipe.discoveryTags.map(({ name }) => name).join(', '),
    'Custom tags': recipe.customTags.map(({ name }) => name).join(', '),
  }

  return (
    <div className="p-4 whitespace-pre-wrap">
      {Object.entries(fields).map(([label, value]) => (
        <p key={label}>
          {label}: {value === null || value === '' ? 'Not provided' : value}
        </p>
      ))}

      <p>Ingredients: {recipe.ingredients.length === 0 ? 'None' : ''}</p>
      {recipe.ingredients.map((ingredient, index) => (
        <div key={ingredient.id}>
          <p>
            Ingredient {index + 1}: {ingredient.name}
          </p>
          <p>Ingredient ID: {ingredient.id}</p>
          <p>Quantity: {ingredient.quantity ?? 'Not provided'}</p>
          <p>Unit: {ingredient.unit ?? 'Not provided'}</p>
          <p>Sort order: {ingredient.sortOrder}</p>
        </div>
      ))}

      <p>Instructions: {recipe.instructions.length === 0 ? 'None' : ''}</p>
      {recipe.instructions.map((instruction, index) => (
        <div key={instruction.id}>
          <p>
            Instruction {index + 1}: {instruction.text}
          </p>
          <p>Instruction ID: {instruction.id}</p>
          <p>Sort order: {instruction.sortOrder}</p>
          <p>Image key: {instruction.imageKey ?? 'Not provided'}</p>
          <p>
            Instruction ingredients:{' '}
            {instruction.ingredientUsages.length === 0 ? 'None' : ''}
          </p>
          {instruction.ingredientUsages.map((usage) => (
            <div key={usage.ingredientId}>
              <p>
                Ingredient:{' '}
                {recipe.ingredients.find(({ id }) => id === usage.ingredientId)
                  ?.name ?? usage.ingredientId}
              </p>
              <p>Ingredient ID: {usage.ingredientId}</p>
              <p>Quantity used: {usage.quantityUsed ?? 'Not provided'}</p>
            </div>
          ))}
        </div>
      ))}

      <p>
        Parent recipe:{' '}
        {recipe.parentRecipe ? (
          <Link
            to="/recipes/$recipeId/$slug"
            params={{
              recipeId: recipe.parentRecipe.id,
              slug: recipeSlug(recipe.parentRecipe.title),
            }}
            className="underline focus-visible:outline-2"
          >
            {recipe.parentRecipe.title ?? 'Untitled recipe'}
          </Link>
        ) : (
          'None available'
        )}
      </p>
      <p>
        Saved: {viewerState ? String(viewerState.isSaved) : 'Not signed in'}
      </p>
      <p>Made: {viewerState ? String(viewerState.hasMade) : 'Not signed in'}</p>
      <p>Personal note: {viewerState?.personalNote ?? 'None'}</p>
    </div>
  )
}
