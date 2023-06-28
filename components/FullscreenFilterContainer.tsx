import clsx from "clsx"

import { onRightClick } from "~utils/browser"

export default function ({
  children,
  onClickOutside,
  classnames
}: {
  children: React.ReactNode
  onClickOutside?: () => void
  classnames?: string
}) {
  return (
    <div
      className={clsx(
        "flex items-center fixed inset-0 w-screen h-screen",
        classnames
      )}
      onClick={onClickOutside}
      onContextMenu={onRightClick}>
      <div onClick={onRightClick} className="inline-block">
        {children}
      </div>
    </div>
  )
}
