import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'
import { Skeleton } from '#/components/ui/skeleton'
import ScrollRow from '#/components/ui/ScrollRow'
import PageLayout from '#/components/PageLayout'

export const Route = createFileRoute('/_app/')({ component: HomePage })

function HomePage() {
  return (
    <PageLayout
      centered
      header={
        <>
          <FeedNavigation />
          <h1
            id="explore-title"
            className="hidden font-fraunces text-4xl font-semibold md:block"
          >
            Explore
          </h1>
        </>
      }
      contentClassName="space-y-12 pb-40 md:space-y-16 md:pb-48"
    >
      {/* TODO: Connect search and enable this input when searching is implemented. */}
      <section aria-label="Search" className="mb-4 md:mb-6">
        <label htmlFor="explore-search" className="sr-only">
          Search for recipes, cookbooks, and users
        </label>
        <input
          id="explore-search"
          type="search"
          placeholder="Search for recipes, cookbooks, and users"
          // disabled
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 disabled:opacity-50"
        />
      </section>

      {/* TODO: Connect each section's query independently. Show its skeletons only
          while pending; render loaded items, an empty state, or an error otherwise.
          These skeletons remain visible until the data sources are connected. */}
      <section aria-labelledby="discover-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="discover-title"
        >
          Discover
        </h2>
        {/* TODO: Style discover skeletons to match your loaded items. */}
        {/* TODO: Replace this loading block with discover items once loaded. */}
        <p role="status" className="sr-only">
          Loading discover items...
        </p>
        <ScrollRow
          label="Discover"
          paged
          className="[--columns:2] sm:max-md:grid-rows-2 md:max-[1025px]:grid-rows-2 md:max-[1025px]:[--columns:3] min-[1025px]:max-xl:[--columns:4] xl:[--columns:5]"
        >
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index} aria-hidden="true" className="min-w-0 snap-start">
              <Skeleton className="h-20 w-full sm:h-24 md:h-28 min-[1025px]:h-32" />
            </li>
          ))}
        </ScrollRow>
      </section>

      <section aria-labelledby="recipe-of-the-day-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="recipe-of-the-day-title"
        >
          Recipe of the day
        </h2>
        {/* TODO: Style the full-width banner and recipe info skeletons. */}
        {/* TODO: Replace this loading block with the featured recipe once loaded. */}
        <p role="status" className="sr-only">
          Loading recipe of the day...
        </p>
        <div aria-hidden="true">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </section>

      <section aria-labelledby="explore-recipes-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="explore-recipes-title"
        >
          Explore recipes
        </h2>
        {/* TODO: Style recipe skeletons to match your recipe cards. */}
        {/* TODO: Replace this loading block with recipe items once loaded. */}
        <p role="status" className="sr-only">
          Loading recipes...
        </p>
        <ScrollRow
          label="Explore recipes"
          paged
          className="grid-rows-4 [--columns:2] md:max-[1025px]:grid-rows-3 md:max-[1025px]:[--columns:3] min-[1025px]:grid-rows-2 min-[1025px]:gap-y-8 min-[1025px]:max-xl:[--columns:4] xl:[--columns:5]"
        >
          {Array.from({ length: 20 }, (_, index) => (
            <li key={index} aria-hidden="true" className="min-w-0 snap-start">
              <Skeleton className="h-24 w-full rounded-2xl sm:h-28 md:h-32 min-[1025px]:h-40" />
            </li>
          ))}
        </ScrollRow>
      </section>

      <section aria-labelledby="explore-cooks-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="explore-cooks-title"
        >
          Explore our cooks
        </h2>
        {/* TODO: Style circular avatar and cook name skeletons. */}
        {/* TODO: Replace this loading block with cook avatars once loaded. */}
        <p role="status" className="sr-only">
          Loading cooks...
        </p>
        <ScrollRow
          label="Explore our cooks"
          paged
          className="[--columns:4] md:max-[1025px]:[--columns:5] min-[1025px]:[--columns:8]"
        >
          {Array.from({ length: 16 }, (_, index) => (
            <li key={index} aria-hidden="true" className="min-w-0 snap-start">
              <Skeleton className="aspect-square w-full rounded-full" />
              <Skeleton className="mt-3 h-3 w-full sm:mt-4 md:h-4" />
            </li>
          ))}
        </ScrollRow>
      </section>

      <section aria-labelledby="explore-cookbooks-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="explore-cookbooks-title"
        >
          Explore cookbooks
        </h2>
        {/* TODO: Style cookbook cover and title skeletons. */}
        {/* TODO: Replace this loading block with cookbook items once loaded. */}
        <p role="status" className="sr-only">
          Loading cookbooks...
        </p>
        <ScrollRow
          label="Explore cookbooks"
          paged
          className="[--columns:1] md:max-xl:[--columns:2] min-[1025px]:grid-rows-2 min-[1025px]:gap-y-8 xl:[--columns:3]"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <li key={index} aria-hidden="true" className="min-w-0 snap-start">
              <Skeleton className="h-28 w-full rounded-2xl sm:h-32 md:h-40 min-[1025px]:h-48" />
              <Skeleton className="mt-3 h-3 w-2/3 sm:mt-4 sm:h-4 md:h-5" />
            </li>
          ))}
        </ScrollRow>
      </section>

      <section aria-labelledby="popular-tags-title">
        <h2
          className="mb-6 font-fraunces text-xl font-semibold"
          id="popular-tags-title"
        >
          Popular tags
        </h2>
        {/* TODO: Style tag skeletons to match your tag pills. */}
        {/* TODO: Replace this loading block with popular tags once loaded. */}
        <p role="status" className="sr-only">
          Loading popular tags...
        </p>
        <ScrollRow
          label="Popular tags"
          className="min-[1025px]:grid min-[1025px]:grid-flow-col min-[1025px]:grid-rows-2 min-[1025px]:auto-cols-max min-[1025px]:gap-y-8"
        >
          {[0, 1, 2, 3, 4, 6, 7, 8, 9].map((index) => (
            <li key={index} aria-hidden="true" className="shrink-0">
              <Skeleton className="h-8 w-24 rounded-full" />
            </li>
          ))}
        </ScrollRow>
      </section>
    </PageLayout>
  )
}
