import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'
import { Skeleton } from '#/components/ui/skeleton'
import FeedNavigation from '../features/activity/components/FeedNavigation'
import ActivityCard from '#/features/activity/components/ActivityCard'
import { fetchFollowingFeed } from '#/features/activity/functions/following-feed.functions'

export const Route = createFileRoute('/_app/following')({
  loader: () => fetchFollowingFeed(),
  headers: () => ({ 'Cache-Control': 'no-store' }),
  pendingComponent: () => (
    <PageLayout centered header={<h1>Following feed</h1>}>
      <p role="status">Loading activities...</p>
    </PageLayout>
  ),
  errorComponent: () => (
    <PageLayout centered header={<h1>Following feed</h1>}>
      <p role="alert">Unable to load activities.</p>
    </PageLayout>
  ),
  component: FollowingPage,
})

function FollowingPage() {
  const { items, asOf } = Route.useLoaderData()
  return (
    <PageLayout
      centered
      header={
        <>
          <FeedNavigation />
          <h1 id="following-title" className="hidden md:block">
            Following
          </h1>
        </>
      }
      contentClassName="space-y-12 pb-40 md:space-y-16 md:pb-48"
    >
      {/* TODO: Style these static preview placeholders, then move them into
          the loading state when the activity layout is ready. */}
      <ul aria-hidden="true" className="space-y-12 md:space-y-16">
        {[0, 1, 2, 3, 4].map((index) => (
          <li key={index} className="min-w-0 w-full space-y-6">
            {/* TODO: Match the avatar, author name, and timestamp dimensions. */}
            <div className="flex items-center gap-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="h-3 w-24 max-w-full" />
              </div>
            </div>

            {/* TODO: Match the recipe thumbnail's final aspect ratio. */}
            <Skeleton className="h-40 w-full rounded-2xl md:h-48 min-[1025px]:h-56" />

            {/* TODO: Style the title, info pill, and supporting text. */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-6">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-20 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-3 w-2/3" />
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p>No published recipe activities yet.</p>
      ) : (
        <ul className="space-y-12 md:space-y-16">
          {items.map((activity) => (
            <li key={activity.id}>
              <ActivityCard activity={activity} asOf={asOf} />
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  )
}
