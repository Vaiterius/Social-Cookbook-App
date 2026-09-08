import { createFileRoute } from '@tanstack/react-router'
import FeedNavigation from '../features/activity/components/FeedNavigation'

export const Route = createFileRoute('/_app/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <FeedNavigation />
      <p>Viewing explore feed...</p>
    </>
  )
}
