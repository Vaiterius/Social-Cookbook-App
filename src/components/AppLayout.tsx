import type { ReactNode } from 'react'
import { useMatchRoute } from '@tanstack/react-router'
import AppSidebar from './navigation/AppSidebar'
import MobileBottomNav from './navigation/MobileBottomNav'
import { cn } from '#/lib/utils'

export default function AppLayout({ children }: { children: ReactNode }) {
  const matchRoute = useMatchRoute()
  const isExplore = Boolean(matchRoute({ to: '/', fuzzy: false }))

  return (
    <>
      <div
        className={cn(
          'min-h-dvh md:grid md:grid-cols-4 lg:grid-cols-5',
          isExplore && 'h-dvh overflow-hidden md:grid-rows-1',
        )}
      >
        <AppSidebar />
        <main
          className={cn(
            'min-w-0 md:col-span-3 lg:col-span-4',
            isExplore ? 'h-full min-h-0' : 'pb-20 md:pb-0',
          )}
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}
