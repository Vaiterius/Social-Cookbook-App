import SvgIcon from '#/components/icons/SvgIcon'
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
      className={
        sidebar
          ? 'flex min-h-11 items-center gap-3 text-left disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          : undefined
      }
    >
      {sidebar && <SvgIcon src={logOut} />}
      Logout (coming soon)
    </button>
  )
}
