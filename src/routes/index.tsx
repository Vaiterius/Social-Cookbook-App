import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">sapori</h1>
      <p className="mt-3 text-muted-foreground">
        A social recipe manager. Coming soon.
      </p>
    </main>
  )
}
