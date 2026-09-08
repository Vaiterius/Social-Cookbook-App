import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return <h1>Privacy policy</h1>
}
