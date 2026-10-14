import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'

export const Route = createFileRoute('/_app/privacy-policy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return <PageLayout header={<h1>Privacy Policy</h1>} />
}
