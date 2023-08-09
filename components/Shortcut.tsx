import clsx from "clsx"
import { useState } from "react"

interface IProps {
  title: string
  shortcut: string
  hadBeUsed: (shortcut: string) => boolean
  onChange: (shortcut: string) => void
}
export default function ({ title, shortcut, hadBeUsed, onChange }: IProps) {
  const [focusId, setFocusId] = useState<number>()
  const [keys, setKeys] = useState<string[]>(shortcut.split("+"))
  const onExitFocus = () => {}
  return (
    <div className="flex items-center gap-2 p-2">
      <span className="rounded-full w-2 h-2 bg-green-400"></span>
      <div className="mr-auto">{title}</div>
      <button
        onClick={() => setFocusId(0)}
        className={clsx(
          "w-16 min-h-[28.5px] rounded-md p-1 border border-gray-300 border-opacity-30",
          {
            "border-opacity-100": focusId === 0
          }
        )}>
        {keys[0]}
      </button>
      <button
        onClick={() => setFocusId(1)}
        className={clsx(
          "w-16 min-h-[28.5px] rounded-md p-1 border border-gray-300 border-opacity-30",
          {
            "border-opacity-100": focusId === 1
          }
        )}>
        {keys[1]}
      </button>
      <button
        onClick={() => setFocusId(2)}
        className={clsx(
          "w-16 min-h-[28.5px] rounded-md p-1 border border-gray-300 border-opacity-30",
          {
            "border-opacity-100": focusId === 2
          }
        )}>
        {keys[2]}
      </button>
    </div>
  )
}
