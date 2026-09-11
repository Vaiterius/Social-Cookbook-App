import RecipeCard from '#/features/recipes/components/RecipeCard'
import type { getFollowingFeed } from '../services/following-feed.server'

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function activityTimeLabel(createdAt: Date, asOf: Date) {
  const seconds = Math.max(
    0,
    Math.floor((asOf.getTime() - createdAt.getTime()) / 1000),
  )
  if (seconds >= 86400)
    return relativeTime.format(-Math.floor(seconds / 86400), 'day')
  if (seconds >= 3600)
    return relativeTime.format(-Math.floor(seconds / 3600), 'hour')
  if (seconds >= 60)
    return relativeTime.format(-Math.floor(seconds / 60), 'minute')
  return relativeTime.format(-seconds, 'second')
}

interface ActivityCardProps {
  activity: Awaited<ReturnType<typeof getFollowingFeed>>['items'][number]
  asOf: Date
}

export default function ActivityCard({ activity, asOf }: ActivityCardProps) {
  return (
    <article>
      <header>
        {activity.actor.image ? (
          <img
            src={activity.actor.image}
            alt=""
            width={48}
            height={48}
            loading="lazy"
          />
        ) : (
          <p>No avatar available.</p>
        )}
        <p>{activity.actor.name} published a recipe.</p>
        <time
          dateTime={activity.createdAt.toISOString()}
          title={activity.createdAt.toISOString()}
        >
          {activityTimeLabel(activity.createdAt, asOf)}
        </time>
      </header>
      <RecipeCard recipe={activity.recipe} viewerState={activity.viewerState} />
    </article>
  )
}
