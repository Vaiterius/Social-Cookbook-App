import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'
import { Skeleton } from '#/components/ui/skeleton'
import ScrollRow from '#/components/ui/ScrollRow'
import PageLayout from '#/components/PageLayout'

export const Route = createFileRoute('/_app/')({ component: HomePage })

function HomePage() {
  return (
    <PageLayout
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
        <ScrollRow label="Discover">
          {[0, 1, 2, 3, 4].map((index) => (
            <li key={index} aria-hidden="true" className="shrink-0">
              <Skeleton className="h-32 w-48" />
              <Skeleton className="mt-4 h-4 w-32" />
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
        <ScrollRow label="Explore recipes">
          {[0, 1, 2, 3].map((index) => (
            <li key={index} aria-hidden="true" className="shrink-0">
              <Skeleton className="h-40 w-56 rounded-2xl" />
              <Skeleton className="mt-4 h-5 w-40" />
              <Skeleton className="mt-4 h-4 w-24" />
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
        <ScrollRow label="Explore our cooks">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <li key={index} aria-hidden="true" className="shrink-0">
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="mt-4 h-4 w-20" />
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
        <ScrollRow label="Explore cookbooks">
          {[0, 1, 2].map((index) => (
            <li key={index} aria-hidden="true" className="shrink-0">
              <Skeleton className="h-48 w-80 rounded-2xl md:w-md" />
              <Skeleton className="mt-4 h-5 w-56" />
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
        <ScrollRow label="Popular tags">
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
