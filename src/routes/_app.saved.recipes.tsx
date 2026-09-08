import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/saved/recipes')({
  component: SavedRecipesPage,
})

function SavedRecipesPage() {
  return <p>Viewing all recipes...</p>
}
