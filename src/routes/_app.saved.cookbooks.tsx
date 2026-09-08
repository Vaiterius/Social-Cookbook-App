import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/saved/cookbooks')({
  component: SavedCookbooksPage,
})

function SavedCookbooksPage() {
  return <h1>Saved Cookbooks</h1>
}
