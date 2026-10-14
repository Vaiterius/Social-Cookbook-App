import { Outlet, createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'
import LibraryNavigation from '../components/navigation/LibraryNavigation'

export const Route = createFileRoute('/_app/library')({
  component: LibraryLayout,
})

function LibraryLayout() {
  return (
    <PageLayout
      header={
        <>
          <h1>Library</h1>
          <LibraryNavigation />
        </>
      }
    >
      <Outlet />
    </PageLayout>
  )
}
