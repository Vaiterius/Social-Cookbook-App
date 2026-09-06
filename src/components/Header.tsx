import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b bg-background">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"
      >
        <Link
          to="/"
          className="rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          sapori
        </Link>
      </nav>
    </header>
  )
}
