export function recipeSlug(title: string | null) {
  // The ID provides identity, so duplicate titles are fine. Keep this client-safe
  // and provide a usable segment for untitled drafts or punctuation-only titles.
  return (
    (title ?? '')
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'untitled-recipe'
  )
}
