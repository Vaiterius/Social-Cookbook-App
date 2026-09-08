import { Outlet, createFileRoute } from '@tanstack/react-router'
import SavedNavigation from '../components/navigation/SavedNavigation'

export const Route = createFileRoute('/_app/saved')({ component: SavedLayout })

function SavedLayout() {
  return (
    <>
      <SavedNavigation />
      <Outlet />
    </>
  )
}
