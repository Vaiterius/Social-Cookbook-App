import SidebarIcon from '#/components/navigation/SidebarIcon'
import { sidebarLinkClassName } from '#/components/navigation/sidebarStyles'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import LogoutPlaceholder from './LogoutPlaceholder'
import settings from '#/components/icons/settings.svg'
import receiptText from '#/components/icons/receipt-text.svg'
import shield from '#/components/icons/shield.svg'

/** Groups secondary sidebar links beneath a divider and keeps logout at the bottom; profile links stay plain. */
export default function AccountNavigation({
  sidebar = false,
}: {
  sidebar?: boolean
}) {
  const linkClassName = sidebar ? cn(sidebarLinkClassName, 'py-1.5') : undefined
  return (
    <nav
      aria-label="Account navigation"
      className={sidebar ? 'flex flex-1 flex-col text-sm' : undefined}
    >
      {sidebar && (
        <div
          aria-hidden="true"
          className="mx-3 mb-4 border-t border-neutral-200/60"
        />
      )}
      <ul className={sidebar ? 'flex flex-1 flex-col' : undefined}>
        <li>
          <Link to="/settings" className={linkClassName}>
            {sidebar && <SidebarIcon src={settings} />}
            Settings
          </Link>
        </li>
        <li>
          <Link to="/terms-of-use" className={linkClassName}>
            {sidebar && <SidebarIcon src={receiptText} />}
            Terms of Use
          </Link>
        </li>
        <li>
          <Link to="/privacy-policy" className={linkClassName}>
            {sidebar && <SidebarIcon src={shield} />}
            Privacy Policy
          </Link>
        </li>
        <li className={sidebar ? 'mt-auto pt-4' : undefined}>
          <LogoutPlaceholder sidebar={sidebar} />
        </li>
      </ul>
    </nav>
  )
}
