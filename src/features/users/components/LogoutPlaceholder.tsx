import SidebarIcon from '#/components/navigation/SidebarIcon'
import { sidebarLinkClassName } from '#/components/navigation/sidebarStyles'
import { cn } from '#/lib/utils'
import logOut from '#/components/icons/log-out.svg'

/** Disabled until sign-out is implemented; the sidebar variant matches its icon navigation. */
export default function LogoutPlaceholder({
  sidebar = false,
}: {
  sidebar?: boolean
}) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        sidebar && sidebarLinkClassName,
        'text-destructive hover:text-destructive focus-visible:text-destructive',
        sidebar && 'py-1.5 text-sm',
      )}
    >
      {sidebar && <SidebarIcon src={logOut} />}
      Logout (coming soon)
    </button>
  )
}
