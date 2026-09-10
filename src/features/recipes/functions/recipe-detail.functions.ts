import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { isUuid, validateRecipeDetailInput } from '../validation/recipe-detail'

export const fetchRecipeDetail = createServerFn({ method: 'GET' })
  .validator(validateRecipeDetailInput)
  .handler(async ({ data }) => {
    const { auth } = await import('#/lib/auth')
    const { getRecipeDetail } = await import('../services/recipe-detail.server')

    // The combined response can contain personal notes, even for a public recipe.
    setResponseHeader('Cache-Control', 'private, no-store')

    // Derive identity from the session, never from RPC input supplied by the viewer.
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    // The auth scaffold may issue non-UUID IDs that do not map to application users.
    const viewerId = isUuid(session?.user.id) ? session.user.id : null

    return getRecipeDetail(data.recipeId, viewerId)
  })
