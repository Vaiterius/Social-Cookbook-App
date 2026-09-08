import { Link } from '@tanstack/react-router'

export default function LibraryNavigation() {
  return (
    <nav aria-label="Library" className="md:hidden">
      <ul>
        <li>
          <Link to="/library/recipes">My Recipes</Link>
        </li>
        <li>
          <Link to="/library/cookbooks">My Cookbooks</Link>
        </li>
      </ul>
    </nav>
  )
}
