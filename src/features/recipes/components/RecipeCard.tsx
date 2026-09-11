import { Link } from '@tanstack/react-router'
import { recipeSlug } from '../recipe-slug'

interface RecipeCardProps {
  recipe: {
    id: string
    title: string | null
    caption: string | null
    thumbnailUrl: string | null
    author: { id: string; name: string }
    difficulty: string | null
    totalTimeMinutes: number | null
  }
  viewerState: { isSaved: boolean; hasMade: boolean } | null
}

export default function RecipeCard({ recipe, viewerState }: RecipeCardProps) {
  return (
    <section aria-label="Recipe preview">
      {recipe.thumbnailUrl ? (
        <img
          src={recipe.thumbnailUrl}
          alt={recipe.title ?? 'Recipe'}
          loading="lazy"
        />
      ) : (
        <p>No recipe image available.</p>
      )}
      <h2>
        <Link
          to="/recipes/$recipeId/$slug"
          params={{
            recipeId: recipe.id,
            slug: recipeSlug(recipe.title),
          }}
        >
          {recipe.title ?? 'Untitled recipe'}
        </Link>
      </h2>
      <p>By {recipe.author.name}</p>
      <p>{recipe.caption ?? 'No caption provided.'}</p>
      <p>Difficulty: {recipe.difficulty ?? 'Not provided'}</p>
      <p>
        Total time:{' '}
        {recipe.totalTimeMinutes === null
          ? 'Not provided'
          : `${recipe.totalTimeMinutes} minutes`}
      </p>
      <p>
        Saved: {viewerState ? String(viewerState.isSaved) : 'Not signed in'}
      </p>
      <p>Made: {viewerState ? String(viewerState.hasMade) : 'Not signed in'}</p>
    </section>
  )
}
