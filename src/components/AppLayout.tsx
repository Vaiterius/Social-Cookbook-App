import type { ReactNode } from 'react'
import AppSidebar from './navigation/AppSidebar'
import MobileBottomNav from './navigation/MobileBottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-dvh overflow-hidden md:grid md:grid-cols-4 md:grid-rows-1 lg:grid-cols-5">
        <AppSidebar />
        <main className="h-full min-h-0 min-w-0 md:col-span-3 lg:col-span-4">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}
