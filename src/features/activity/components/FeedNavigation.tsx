import { Link } from '@tanstack/react-router'

export default function FeedNavigation() {
  return (
    <nav aria-label="Feeds" className="md:hidden">
      <ul>
        <li>
          <Link to="/" activeOptions={{ exact: true }}>
            Explore
          </Link>
        </li>
        <li>
          <Link to="/following">Following</Link>
        </li>
      </ul>
    </nav>
  )
}
