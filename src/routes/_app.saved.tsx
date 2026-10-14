import { Outlet, createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'
import SavedNavigation from '../components/navigation/SavedNavigation'

export const Route = createFileRoute('/_app/saved')({ component: SavedLayout })

function SavedLayout() {
  return (
    <PageLayout
      header={
        <>
          <h1>Saved</h1>
          <SavedNavigation />
        </>
      }
    >
      <Outlet />
    </PageLayout>
  )
}
