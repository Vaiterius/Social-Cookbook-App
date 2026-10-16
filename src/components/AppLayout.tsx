import type { ReactNode } from 'react'
import AppSidebar from './navigation/AppSidebar'
import MobileBottomNav from './navigation/MobileBottomNav'

/** Keeps navigation stationary and exposes its width so pages can align against the viewport. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-dvh overflow-hidden md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] md:grid-rows-1 md:[--sidebar-width:18rem]">
        <AppSidebar />
        <main className="h-full min-h-0 min-w-0">{children}</main>
      </div>
      <MobileBottomNav />
    </>
  )
}
