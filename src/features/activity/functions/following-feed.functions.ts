import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

export const fetchFollowingFeed = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getFollowingFeed } =
      await import('../services/following-feed.server')
    // Avoid retaining a public response after a recipe becomes private.
    setResponseHeader('Cache-Control', 'no-store')
    return getFollowingFeed()
  },
)
