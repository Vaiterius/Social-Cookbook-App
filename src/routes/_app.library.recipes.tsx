import { createFileRoute } from '@tanstack/react-router'
import { RecipeCollectionSkeleton } from '#/components/CollectionSkeletons'

export const Route = createFileRoute('/_app/library/recipes')({
  component: MyRecipesPage,
})

function MyRecipesPage() {
  return (
    <section aria-labelledby="my-recipes-title" className="space-y-6">
      <h2 id="my-recipes-title" className="font-fraunces text-xl font-semibold">
        My recipes
      </h2>
      {/* TODO: Replace these static previews with data; show skeletons only while loading. */}
      <RecipeCollectionSkeleton />
    </section>
  )
}
