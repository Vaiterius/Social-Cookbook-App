import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/library/')({
  beforeLoad: () => {
    throw redirect({ to: '/library/recipes', replace: true })
  },
})
