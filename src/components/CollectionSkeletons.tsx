import { Skeleton } from '#/components/ui/skeleton'

/** Shared recipe placeholders keep Saved and Library previews consistent until their data is wired up. */
export function RecipeCollectionSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 min-[1025px]:grid-cols-3"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <li key={index} className="min-w-0 space-y-4">
          {/* TODO: Match the final recipe thumbnail and card metadata. */}
          <Skeleton className="h-24 w-full rounded-2xl md:h-32 min-[1025px]:h-40" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-1/5 rounded-full" />
          </div>
          <Skeleton className="h-3 w-2/3" />
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Wider cookbook placeholders mirror Explore's covers while fitting a vertically scrolling collection. */
export function CookbookCollectionSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 md:gap-x-6 md:gap-y-16"
    >
      {[0, 1, 2, 3].map((index) => (
        <li key={index} className="min-w-0 space-y-4">
          {/* TODO: Match the final cookbook cover, title, and recipe count. */}
          <Skeleton className="h-32 w-full rounded-2xl md:h-40 min-[1025px]:h-48" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-1/5 rounded-full" />
          </div>
          <Skeleton className="h-3 w-2/3" />
        </li>
      ))}
    </ul>
  )
}
