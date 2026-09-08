import { Outlet, createFileRoute } from '@tanstack/react-router'
import LibraryNavigation from '../components/navigation/LibraryNavigation'

export const Route = createFileRoute('/_app/library')({
  component: LibraryLayout,
})

function LibraryLayout() {
  return (
    <>
      <LibraryNavigation />
      <Outlet />
    </>
  )
}
