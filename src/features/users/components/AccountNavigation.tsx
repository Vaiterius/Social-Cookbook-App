import { Link } from '@tanstack/react-router'
import LogoutPlaceholder from './LogoutPlaceholder'

export default function AccountNavigation() {
  return (
    <nav aria-label="Account navigation">
      <ul>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <Link to="/terms">Terms of service</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy policy</Link>
        </li>
        <li>
          <LogoutPlaceholder />
        </li>
      </ul>
    </nav>
  )
}
