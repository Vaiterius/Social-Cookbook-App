import type { ReactNode } from 'react'
import AppSidebar from './navigation/AppSidebar'
import MobileBottomNav from './navigation/MobileBottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="min-h-dvh md:grid md:grid-cols-4 lg:grid-cols-5">
        <AppSidebar />
        <main className="min-w-0 pb-20 md:col-span-3 md:pb-0 lg:col-span-4">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </>
  )
}
