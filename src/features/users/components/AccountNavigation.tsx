import SvgIcon from '#/components/icons/SvgIcon'
import { Link } from '@tanstack/react-router'
import LogoutPlaceholder from './LogoutPlaceholder'
import settings from '#/components/icons/settings.svg'
import receiptText from '#/components/icons/receipt-text.svg'
import shield from '#/components/icons/shield.svg'

/** Sidebar presentation adds icons and spacing without changing the profile page's account links. */
export default function AccountNavigation({
  sidebar = false,
}: {
  sidebar?: boolean
}) {
  const linkClassName = sidebar
    ? 'flex min-h-11 items-center gap-3 focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:outline-none'
    : undefined
  return (
    <nav aria-label="Account navigation">
      <ul className={sidebar ? 'space-y-2' : undefined}>
        <li>
          <Link to="/settings" className={linkClassName}>
            {sidebar && <SvgIcon src={settings} />}
            Settings
          </Link>
        </li>
        <li>
          <Link to="/terms-of-use" className={linkClassName}>
            {sidebar && <SvgIcon src={receiptText} />}
            Terms of Use
          </Link>
        </li>
        <li>
          <Link to="/privacy-policy" className={linkClassName}>
            {sidebar && <SvgIcon src={shield} />}
            Privacy Policy
          </Link>
        </li>
        <li>
          <LogoutPlaceholder sidebar={sidebar} />
        </li>
      </ul>
    </nav>
  )
}
