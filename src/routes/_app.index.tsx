import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'

export const Route = createFileRoute('/_app/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <h1>Explore</h1>
      <FeedNavigation />
    </>
  )
}
