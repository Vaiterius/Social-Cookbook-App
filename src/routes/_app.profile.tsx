import { createFileRoute } from '@tanstack/react-router'
import AccountNavigation from '../features/users/components/AccountNavigation'

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <>
      <h1>Profile</h1>
      <AccountNavigation />
    </>
  )
}
