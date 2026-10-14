import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

/**
 * Shared page frame: keeps the header outside the scrollable content so it stays
 * visible while the document and sidebar remain stationary. Use once per page
 * inside the viewport-sized AppLayout; `page-content` is the router's scroll
 * restoration target. Nested routes should reuse their parent's PageLayout. This
 * is also to prevent scrolling on the left sidebar.
 */
export default function PageLayout({
  header,
  children,
  contentClassName,
}: {
  header: ReactNode
  children?: ReactNode
  contentClassName?: string
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-offwhite text-neutral-900">
      <header className="shrink-0 bg-offwhite px-6 py-4 md:px-10 md:py-5 lg:px-16">
        {header}
      </header>
      <div
        id="page-content"
        role="region"
        aria-label="Page content"
        tabIndex={0}
        className={cn(
          'scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pt-2 pb-24 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olive md:px-10 md:pt-5 md:pb-12 lg:px-16',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
