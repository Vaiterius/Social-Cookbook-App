import { createFileRoute } from '@tanstack/react-router'
import { CookbookCollectionSkeleton } from '#/components/CollectionSkeletons'

export const Route = createFileRoute('/_app/library/cookbooks')({
  component: MyCookbooksPage,
})

function MyCookbooksPage() {
  return (
    <section aria-labelledby="my-cookbooks-title" className="space-y-6">
      <h2
        id="my-cookbooks-title"
        className="font-fraunces text-xl font-semibold"
      >
        My cookbooks
      </h2>
      {/* TODO: Replace these static previews with data; show skeletons only while loading. */}
      <CookbookCollectionSkeleton />
    </section>
  )
}
