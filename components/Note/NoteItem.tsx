import { marked } from "marked";
import { useEffect, useRef, useState } from "react"
import { CiSettings } from "react-icons/ci"
import { GrFormClose } from "react-icons/gr"
import { HiOutlinePencilSquare } from "react-icons/hi2"

import { INote } from "~types"
import { onStopPaClickPropagation } from "~utils/browser";
import { saveNote } from "~utils/storage";





interface IProps {
  data: INote
  onRemove: (id: string) => void
}
export default function ({ data, onRemove }: IProps) {
  const [note, setNote] = useState(data)
  const timer = useRef<NodeJS.Timer>()
  const [showSetting, setShowSetting] = useState(false)
  const [isPreviewContent, setIsPreviewContent] = useState(!false)

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      saveNote(note)
    }, 100)
  }, [note])

  return (
    <div className="note-item m-4 mt-0">
      <div
        className="rounded-lg border-gray-200  box-border border-dashed border relative group"
        style={{
          background: note.bgColor,
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
        }}
        onContextMenu={onStopPaClickPropagation}>
        <div className="flex gap-2 items-center p-2 pb-0 text-white text-[12px]">
          <span
            className="w-4 h-4 bg-red-400 rounded-full flex justify-center items-center text-center cursor-pointer group"
            onClick={() => onRemove(note.id)}>
            <GrFormClose className="group-hover:opacity-100 opacity-0" />
          </span>
          <span className="w-4 h-4 bg-orange-400 rounded-full text-center group">
            <span className="relative bottom-1 group-hover:opacity-100 opacity-0 group-hover:scale-105 origin-center transform transition-all"></span>
          </span>
          <span
            className="w-4 h-4 bg-green-400 rounded-full flex justify-center items-center text-center cursor-pointer group"
            onClick={() => setShowSetting(true)}>
            <CiSettings className="group-hover:opacity-100 opacity-0" />
          </span>
          <HiOutlinePencilSquare
            className="text-gray-700 opacity-0 group-hover:opacity-100 ml-auto cursor-pointer hover:scale-110 transition-all"
            onClick={() => setIsPreviewContent(!isPreviewContent)}
          />
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
        {isPreviewContent ? (
          <div
            className="min-h-[150px] p-2 markdown-body"
            dangerouslySetInnerHTML={{
              __html: marked.parse(note.content, {
                headerIds: false,
                mangle: false
              })
            }}></div>
        ) : (
          <textarea
            onBlur={() => setIsPreviewContent(true)}
            style={{ color: note.color, background: note.bgColor }}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            value={note.content}
            placeholder="markdown..."
            className="p-2 min-h-[150px] focus-visible:outline-none w-full text-[14px]"
          />
        )}
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
    </div>
  )
}