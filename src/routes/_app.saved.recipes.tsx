import { createFileRoute } from '@tanstack/react-router'
import { RecipeCollectionSkeleton } from '#/components/CollectionSkeletons'

export const Route = createFileRoute('/_app/saved/recipes')({
  component: SavedRecipesPage,
})

function SavedRecipesPage() {
  return (
    <section aria-labelledby="saved-recipes-title" className="space-y-6">
      <h2
        id="saved-recipes-title"
        className="font-fraunces text-xl font-semibold"
      >
        Saved recipes
      </h2>
      {/* TODO: Replace these static previews with data; show skeletons only while loading. */}
      <RecipeCollectionSkeleton />
    </section>
  )
}
