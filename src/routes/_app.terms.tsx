import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/terms')({ component: TermsPage })

function TermsPage() {
  return <h1>Terms of service</h1>
}
