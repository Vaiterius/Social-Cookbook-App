import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'
import ActivityCard from '#/features/activity/components/ActivityCard'
import { fetchFollowingFeed } from '#/features/activity/functions/following-feed.functions'

export const Route = createFileRoute('/_app/following')({
  loader: () => fetchFollowingFeed(),
  headers: () => ({ 'Cache-Control': 'no-store' }),
  pendingComponent: () => <p role="status">Loading activities...</p>,
  errorComponent: () => <p role="alert">Unable to load activities.</p>,
  component: FollowingPage,
})

function FollowingPage() {
  const { items, asOf } = Route.useLoaderData()
  return (
    <>
      <FeedNavigation />
      <h1>Following feed</h1>
      {items.length === 0 ? (
        <p>No published recipe activities yet.</p>
      ) : (
        <ul>
          {items.map((activity) => (
            <li key={activity.id}>
              <ActivityCard activity={activity} asOf={asOf} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
