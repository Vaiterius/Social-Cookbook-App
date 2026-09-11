import { findPublicRecipeActivities } from '../repositories/following-feed.server'

export async function getFollowingFeed() {
  // This anonymous feed exposes only public publication events, without viewer data.
  const activities = await findPublicRecipeActivities()
  return {
    // A shared reference time keeps relative labels identical during SSR and hydration.
    asOf: new Date(),
    items: activities.map(({ recipe, author, ...activity }) => ({
      ...activity,
      recipe: {
        ...recipe,
        author,
        thumbnailUrl: null,
        totalTimeMinutes:
          recipe.prepTimeMinutes === null || recipe.cookTimeMinutes === null
            ? null
            : recipe.prepTimeMinutes + recipe.cookTimeMinutes,
      },
      viewerState: null,
    })),
  }
}
