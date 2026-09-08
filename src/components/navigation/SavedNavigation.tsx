import { Link } from '@tanstack/react-router'

export default function SavedNavigation() {
  return (
    <nav aria-label="Saved">
      <ul>
        <li>
          <Link to="/saved/recipes">Recipes</Link>
        </li>
        <li>
          <Link to="/saved/cookbooks">Cookbooks</Link>
        </li>
      </ul>
    </nav>
  )
}
