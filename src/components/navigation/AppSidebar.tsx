import SvgIcon from '#/components/icons/SvgIcon'
import { Link } from '@tanstack/react-router'
import AccountNavigation from '../../features/users/components/AccountNavigation'
import SidebarIcon from './SidebarIcon'
import CreateMenu from './CreateMenu'
import { sidebarLinkClassName as linkClassName } from './sidebarStyles'
import circleUser from '../icons/circle-user.svg'
import compass from '../icons/compass.svg'
import user from '../icons/user.svg'
import bookmark from '../icons/bookmark.svg'
import utensils from '../icons/utensils.svg'
import bookOpen from '../icons/book-open.svg'

export default function AppSidebar() {
  return (
    <aside className="scrollbar-none hidden h-full min-h-0 flex-col gap-8 overflow-y-auto border-r-2 border-neutral-200/60 px-6 py-6 text-neutral-600/90 md:flex">
      <Link
        to="/"
        className="flex min-h-11 shrink-0 items-center rounded-xl font-pacifico text-4xl font-normal text-primary focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        sapori
      </Link>
      <nav aria-label="Sidebar navigation" className="shrink-0">
        <ul className="space-y-2">
          <li className="mb-6">
            {/* No left inset: the avatar aligns with the title and navigation box edges. */}
            <Link
              to="/profile"
              className="flex min-h-11 items-center gap-3 rounded-xl py-2 font-bold focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <SvgIcon src={circleUser} className="size-11" />
              <span className="min-w-0">
                {/* TODO: Replace with the signed-in user's display name. */}
                <span className="block font-fraunces text-neutral-900">
                  Gerard G.
                </span>
                <span className="block text-xs font-semibold">
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
              <SidebarIcon src={compass} />
              Explore
            </Link>
          </li>
          <li>
            <Link to="/following" className={linkClassName}>
              <SidebarIcon src={user} />
              Following
            </Link>
          </li>
          <li>
            <Link to="/saved" className={linkClassName}>
              <SidebarIcon src={bookmark} />
              Saved
            </Link>
          </li>
          <li>
            <Link to="/library/recipes" className={linkClassName}>
              <SidebarIcon src={utensils} />
              My Recipes
            </Link>
          </li>
          <li>
            <Link to="/library/cookbooks" className={linkClassName}>
              <SidebarIcon src={bookOpen} />
              My Cookbooks
            </Link>
          </li>
        </ul>
      </nav>
      <CreateMenu />
      <AccountNavigation sidebar />
    </aside>
  )
}
