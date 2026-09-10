export function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
}

export function validateRecipeDetailInput(input: unknown) {
  if (
    typeof input !== 'object' ||
    input === null ||
    !('recipeId' in input) ||
    !isUuid(input.recipeId)
  ) {
    throw new Error('A valid recipe ID is required')
  }

  return { recipeId: input.recipeId }
}
