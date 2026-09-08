import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/recipes')({
  component: MyRecipesPage,
})

function MyRecipesPage() {
  return <p>Viewing all recipes...</p>
}
