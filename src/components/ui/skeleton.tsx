import type { HTMLAttributes } from 'react'
import { cn } from '#/lib/utils'

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-xl bg-neutral-200 motion-safe:animate-pulse',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
