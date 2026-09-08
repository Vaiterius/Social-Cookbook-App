import type { ReactNode } from 'react'
import AppSidebar from './navigation/AppSidebar'
import MobileBottomNav from './navigation/MobileBottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppSidebar />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
    </>
  )
}
