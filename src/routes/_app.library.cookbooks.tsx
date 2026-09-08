import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/cookbooks')({
  component: MyCookbooksPage,
})

function MyCookbooksPage() {
  return <p>Viewing all cookbooks...</p>
}
