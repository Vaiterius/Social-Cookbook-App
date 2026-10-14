import { createFileRoute } from '@tanstack/react-router'
import PageLayout from '#/components/PageLayout'

export const Route = createFileRoute('/_app/terms-of-use')({
  component: TermsOfUsePage,
})

function TermsOfUsePage() {
  return <PageLayout header={<h1>Terms of use</h1>} />
}
