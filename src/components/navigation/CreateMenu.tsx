import { useId, useLayoutEffect, useRef, useState } from 'react'
import SvgIcon from '#/components/icons/SvgIcon'
import plus from '#/components/icons/plus.svg'
import chevronDown from '#/components/icons/chevron-down.svg'
import utensils from '#/components/icons/utensils.svg'
import bookOpen from '#/components/icons/book-open.svg'
import { cn } from '#/lib/utils'
import { sidebarLinkClassName } from './sidebarStyles'
import styles from './CreateMenu.module.css'

/** Uses a native popover so the menu escapes sidebar clipping and supports outside-click and Escape dismissal. */
export default function CreateMenu() {
  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)

  // Measure the trigger because CSS anchor positioning is not reliable across supported browsers.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const trigger = triggerRef.current
    const updatePosition = () => {
      const { bottom, left, width } = trigger.getBoundingClientRect()
      setPosition({ top: bottom, left, width })
    }

    updatePosition()
    const observer = new ResizeObserver(updatePosition)
    observer.observe(trigger)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  return (
    <div className="shrink-0">
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={menuId}
        className={cn(
          sidebarLinkClassName,
          'cursor-pointer bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:opacity-90 focus-visible:bg-primary focus-visible:text-primary-foreground',
        )}
      >
        <SvgIcon src={plus} />
        Create
        <SvgIcon src={chevronDown} className="ml-auto" />
      </button>
      <div
        id={menuId}
        popover="auto"
        onBeforeToggle={(event) => setOpen(event.newState === 'open')}
        style={position ?? { visibility: 'hidden' }}
        aria-label="Create options"
        className={cn(
          styles.menu,
          'rounded-xl border border-white/20 bg-white/80 p-2 text-neutral-600/90 shadow-sm backdrop-blur-md',
        )}
      >
        {/* TODO: Connect creation flows and remove aria-disabled; keep hover previews available meanwhile. */}
        <button
          type="button"
          aria-disabled="true"
          className={cn(sidebarLinkClassName, 'cursor-pointer text-sm')}
        >
          <SvgIcon src={utensils} />
          Create Recipe
        </button>
        <div
          aria-hidden="true"
          className="mx-3 my-1 border-t border-neutral-200/60"
        />
        <button
          type="button"
          aria-disabled="true"
          className={cn(sidebarLinkClassName, 'cursor-pointer text-sm')}
        >
          <SvgIcon src={bookOpen} />
          Create Cookbook
        </button>
      </div>
    </div>
  )
}
