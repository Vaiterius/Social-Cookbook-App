import { createFileRoute } from '@tanstack/react-router'
import { CookbookCollectionSkeleton } from '#/components/CollectionSkeletons'

export const Route = createFileRoute('/_app/saved/cookbooks')({
  component: SavedCookbooksPage,
})

function SavedCookbooksPage() {
  return (
    <section aria-labelledby="saved-cookbooks-title" className="space-y-6">
      <h2
        id="saved-cookbooks-title"
        className="font-fraunces text-xl font-semibold"
      >
        Saved cookbooks
      </h2>
      {/* TODO: Replace these static previews with data; show skeletons only while loading. */}
      <CookbookCollectionSkeleton />
    </section>
  )
}
