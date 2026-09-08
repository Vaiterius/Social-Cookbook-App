import { Link } from '@tanstack/react-router'
import AccountNavigation from '../../features/users/components/AccountNavigation'
import NavigationAvatar from './NavigationAvatar'

export default function AppSidebar() {
  return (
    <aside className="hidden md:block">
      <Link to="/">sapori</Link>
      <nav aria-label="Sidebar navigation">
        <ul>
          <li>
            <Link to="/profile">
              <NavigationAvatar />
            </Link>
          </li>
          <li>
            <Link to="/" activeOptions={{ exact: true }}>
              Explore
            </Link>
          </li>
          <li>
            <Link to="/following">Following</Link>
          </li>
          <li>
            <Link to="/saved">Saved</Link>
          </li>
          <li>
            <Link to="/library/recipes">My Recipes</Link>
          </li>
          <li>
            <Link to="/library/cookbooks">My Cookbooks</Link>
          </li>
        </ul>
      </nav>
      <AccountNavigation />
    </aside>
  )
}
