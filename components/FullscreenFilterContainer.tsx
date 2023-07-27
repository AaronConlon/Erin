import { EZIndexRecord } from "~types"
import clsx from "clsx"
import { onStopPaClickPropagation } from "~utils/browser"

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
      className={clsx("fixed inset-0 w-screen h-screen z-50", classnames)}
      style={{zIndex: EZIndexRecord.fullscreenLayout}}
      onClick={() => {
        onClickOutside?.()
      }}
      onContextMenu={onStopPaClickPropagation}>
      <div onClick={onStopPaClickPropagation} className="inline-block">
        {children}
      </div>
    </div>
  )
}
