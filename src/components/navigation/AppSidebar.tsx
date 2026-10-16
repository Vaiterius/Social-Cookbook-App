import SvgIcon from '#/components/icons/SvgIcon'
import { Link } from '@tanstack/react-router'
import AccountNavigation from '../../features/users/components/AccountNavigation'
import chefHat from '../icons/chef-hat.svg'
import circleUser from '../icons/circle-user.svg'
import compass from '../icons/compass.svg'
import user from '../icons/user.svg'
import bookmark from '../icons/bookmark.svg'
import utensils from '../icons/utensils.svg'
import bookOpen from '../icons/book-open.svg'

const linkClassName =
  'flex min-h-11 items-center gap-3 focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:outline-none'

export default function AppSidebar() {
  return (
    <aside className="scrollbar-none hidden h-full min-h-0 flex-col gap-8 overflow-y-auto border-r border-neutral-300 px-4 py-6 text-neutral-600 md:flex">
      <Link to="/" className={linkClassName}>
        <SvgIcon src={chefHat} />
        sapori
      </Link>
      <nav aria-label="Sidebar navigation">
        <ul className="space-y-2">
          <li>
            <Link to="/profile" className={linkClassName}>
              <SvgIcon src={circleUser} className="size-8" />
              <span className="min-w-0">
                {/* TODO: Replace with the signed-in user's display name. */}
                <span className="block text-neutral-900">Your name</span>
                <span className="block text-sm text-neutral-600">
                  View profile
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className={linkClassName}
            >
              <SvgIcon src={compass} />
              Explore
            </Link>
          </li>
          <li>
            <Link to="/following" className={linkClassName}>
              <SvgIcon src={user} />
              Following
            </Link>
          </li>
          <li>
            <Link to="/saved" className={linkClassName}>
              <SvgIcon src={bookmark} />
              Saved
            </Link>
          </li>
          <li>
            <Link to="/library/recipes" className={linkClassName}>
              <SvgIcon src={utensils} />
              My Recipes
            </Link>
          </li>
          <li>
            <Link to="/library/cookbooks" className={linkClassName}>
              <SvgIcon src={bookOpen} />
              My Cookbooks
            </Link>
          </li>
        </ul>
      </nav>
      <AccountNavigation sidebar />
    </aside>
  )
}
