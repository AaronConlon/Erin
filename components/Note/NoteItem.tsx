import { useEffect, useRef, useState } from "react"

import { INote } from "~types"
import { onRightClick } from "~utils/browser"
import { saveNote } from "~utils/storage"

interface IProps {
  data: INote
  onRemove: (id: string) => void
}
export default function ({ data, onRemove }: IProps) {
  // const note = {
  //   title: "Just for fun",
  //   content: "love your content.I am so miss you."
  // }

  const [note, setNote] = useState(data)
  const timer = useRef<NodeJS.Timer>()
  const [showSetting, setShowSetting] = useState(false)
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      saveNote(note)
    }, 1000)
  }, [note])

  return (
    <div
      className="rounded-lg border-gray-400 w-[22%] box-border border-dashed border relative inline-block m-5"
      style={{ background: note.bgColor }}
      onContextMenu={onRightClick}>
      <div className="flex gap-2 items-center p-2 pb-0 text-white text-[12px]">
        <span
          className="w-3 h-3 bg-red-400 rounded-full text-center cursor-pointer group"
          onClick={() => onRemove(note.id)}>
          <span className="relative bottom-1 group-hover:opacity-100 opacity-0 group-hover:scale-105 origin-center transform transition-all">
            ⚔
          </span>
        </span>
        <span className="w-3 h-3 bg-orange-400 rounded-full text-center group">
          <span className="relative bottom-1 group-hover:opacity-100 opacity-0 group-hover:scale-105 origin-center transform transition-all"></span>
        </span>
        <span
          className="w-3 h-3 bg-green-400 rounded-full text-center cursor-pointer group"
          onClick={() => setShowSetting(true)}>
          <span className="relative bottom-1 group-hover:opacity-100 opacity-0 group-hover:scale-105 origin-center transform transition-all">
            ⚙
          </span>
        </span>
        <span className="ml-auto text-red-800">{note.id}</span>
      </div>
      <div className="p-1 pt-0">
        <input
          type="text"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          className="p-2 py-1.5 w-full focus-visible:outline-none mt-[3px] text-xl font-bold focus-visible:border-b border border-transparent focus-visible:border-transparent focus-visible:border-b-gray-400"
          style={{ color: note.color, background: note.bgColor }}
        />
      </div>
      <div className="p-2 pt-0 text-[13px]">
        <textarea
          style={{ color: note.color, background: note.bgColor }}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          value={note.content}
          className="p-2 min-h-[150px] focus-visible:outline-none w-full"
        />
      </div>
      {showSetting && (
        <div className="flex flex-col p-1 absolute bottom-0 left-0 right-0 bg-white text-right py-4">
          <button
            className="absolute bottom-2 right-2 p-1 px-1.5 bg-gray-300 text-white rounded-md text-[12px]"
            onClick={() => setShowSetting(false)}>
            收起
          </button>
          <div className="flex gap-1 items-center">
            <label htmlFor="color" className="w-16">
              文字颜色:
            </label>
            <input
              className="focus-visible:outline-none border-b border-gray-300 p-2 py-1"
              type="text"
              name="color"
              value={note.color}
              onChange={(e) =>
                setNote({ ...note, color: e.target.value.trim() })
              }
            />
          </div>
          <div className="flex gap-1 items-center">
            <label htmlFor="color" className="w-16">
              背景色:
            </label>
            <input
              className="focus-visible:outline-none border-b border-gray-300 p-2 py-1"
              type="text"
              name="color"
              value={note.bgColor}
              onChange={(e) =>
                setNote({ ...note, bgColor: e.target.value.trim() })
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
