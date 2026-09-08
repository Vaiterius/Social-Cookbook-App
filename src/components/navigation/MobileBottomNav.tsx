import { Link } from '@tanstack/react-router'
import NavigationAvatar from './NavigationAvatar'

export default function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-max z-10 md:hidden"
    >
      <ul className="flex items-center gap-4">
        <li>
          <Link to="/" activeOptions={{ exact: true }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/saved">Saved</Link>
        </li>
        <li>
          <Link to="/library">Library</Link>
        </li>
        <li>
          <Link to="/profile">
            <NavigationAvatar />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
