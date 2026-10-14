import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return <PageLayout header={<h1>Settings</h1>} />
}
