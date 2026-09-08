import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/saved/')({
  beforeLoad: () => {
    throw redirect({ to: '/saved/recipes', replace: true })
  },
})
