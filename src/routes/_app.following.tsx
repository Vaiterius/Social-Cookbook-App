import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'

export const Route = createFileRoute('/_app/following')({
  component: FollowingPage,
})

function FollowingPage() {
  return (
    <>
      <FeedNavigation />
      <p>Viewing following feed...</p>
    </>
  )
}
