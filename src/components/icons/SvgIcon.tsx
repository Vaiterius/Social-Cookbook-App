import { cn } from '#/lib/utils'

/** Masks a local SVG with the inherited text color; SVGs rendered as images cannot inherit currentColor. */
export default function SvgIcon({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-5 shrink-0 bg-current mask-contain mask-center mask-no-repeat',
        className,
      )}
      style={{ maskImage: `url("${src}")` }}
    />
  )
}
