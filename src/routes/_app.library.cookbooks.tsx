import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/cookbooks')({
  component: MyCookbooksPage,
})

function MyCookbooksPage() {
  return <h1>My Cookbooks</h1>
}
