import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/saved/recipes')({
  component: SavedRecipesPage,
})

function SavedRecipesPage() {
  return <h1>Saved Recipes</h1>
}
