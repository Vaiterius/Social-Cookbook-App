import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/privacy-policy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return <h1>Privacy Policy</h1>
}
