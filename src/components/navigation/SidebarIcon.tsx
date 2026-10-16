import SvgIcon from '#/components/icons/SvgIcon'

/** Gives sidebar icons a consistent footprint so navigation labels line up. */
export default function SidebarIcon({ src }: { src: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center">
      <SvgIcon src={src} />
    </span>
  )
}
