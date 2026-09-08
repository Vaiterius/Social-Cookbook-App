import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/recipes')({
  component: MyRecipesPage,
})

function MyRecipesPage() {
  return <h1>My Recipes</h1>
}
