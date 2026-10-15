import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

/**
 * Shared page frame: keeps the header outside the scrollable content so it stays
 * visible while the document and sidebar remain stationary. Use once per page
 * inside the viewport-sized AppLayout; `page-content` is the router's scroll
 * restoration target. Nested routes should reuse their parent's PageLayout. This
 * is also to prevent scrolling on the left sidebar.
 * `centered` balances the sidebar with right-side space above 1024px, giving the
 * header and content the same viewport-centered, 896px maximum width.
 */
export default function PageLayout({
  header,
  children,
  contentClassName,
  centered = false,
}: {
  header: ReactNode
  children?: ReactNode
  contentClassName?: string
  centered?: boolean
}) {
  const balanceClassName = centered
    ? 'min-[1025px]:pr-(--sidebar-width)'
    : undefined
  const widthClassName = centered ? 'lg:mx-auto lg:max-w-4xl' : undefined

  return (
    <div className="flex h-full min-h-0 flex-col bg-offwhite text-neutral-900">
      <header className="shrink-0 bg-offwhite px-6 py-4 md:px-10 md:py-5 lg:px-16">
        <div className={balanceClassName}>
          <div className={widthClassName}>{header}</div>
        </div>
      </header>
      <div
        id="page-content"
        role="region"
        aria-label="Page content"
        tabIndex={0}
        className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pt-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-olive md:px-10 md:pt-5 lg:px-16"
      >
        <div className={balanceClassName}>
          <div
            className={cn('pb-24 md:pb-12', widthClassName, contentClassName)}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
