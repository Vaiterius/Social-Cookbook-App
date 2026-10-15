import { useEffect, useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

/**
 * Native swipe collection with desktop arrows. Paged rows fit whole columns using
 * the responsive --columns value and grid row classes supplied by the caller.
 */
export default function ScrollRow({
  label,
  children,
  paged = false,
  className,
}: {
  label: string
  children: ReactNode
  paged?: boolean
  className?: string
}) {
  const id = useId()
  const rowRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  function updateEdges() {
    const row = rowRef.current
    if (!row) return
    setEdges({
      left: row.scrollLeft > 1,
      right: row.scrollLeft + row.clientWidth < row.scrollWidth - 1,
    })
  }

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    // Item sizes can change after images load as well as on viewport resize.
    const observer = new ResizeObserver(updateEdges)
    observer.observe(row)
    for (const item of row.children) observer.observe(item)
    updateEdges()
    return () => observer.disconnect()
  }, [children])

  function scroll(direction: number) {
    const row = rowRef.current
    if (!row) return
    row.scrollBy({
      left:
        direction *
        (paged
          ? row.clientWidth + parseFloat(window.getComputedStyle(row).columnGap)
          : row.clientWidth * 0.8),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <div className="relative min-w-0">
      <ul
        id={id}
        ref={rowRef}
        aria-label={label}
        tabIndex={0}
        onScroll={updateEdges}
        className={cn(
          'scrollbar-none flex gap-6 overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olive',
          paged &&
            'grid grid-flow-col grid-rows-1 auto-cols-[calc((100%_-_(var(--columns)_-_1)*var(--row-gap))/var(--columns))] snap-x snap-mandatory gap-(--row-gap) [--row-gap:1rem] sm:[--row-gap:1.25rem] md:[--row-gap:1.5rem]',
          className,
        )}
      >
        {children}
      </ul>
      {[
        { direction: -1, name: 'left', enabled: edges.left, Icon: ChevronLeft },
        {
          direction: 1,
          name: 'right',
          enabled: edges.right,
          Icon: ChevronRight,
        },
      ].map(({ direction, name, enabled, Icon }) => (
        <button
          key={name}
          type="button"
          aria-label={`Scroll ${label} ${name}`}
          aria-controls={id}
          disabled={!enabled}
          onClick={() => scroll(direction)}
          className={`absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/80 text-neutral-900 shadow-sm backdrop-blur-md transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-0 min-[1025px]:flex ${direction === -1 ? 'left-2' : 'right-2'}`}
        >
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}
