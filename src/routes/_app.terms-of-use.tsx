import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/terms-of-use')({
  component: TermsOfUsePage,
})

function TermsOfUsePage() {
  return <h1>Terms of use</h1>
}
