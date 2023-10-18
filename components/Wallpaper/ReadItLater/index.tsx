import { EReadItLaterLevel, EZIndexRecord } from "~types"
import { getReadItLaterList, removeReadItLaterList } from "~utils/storage"
import { onStopPaClickPropagation, openNewTab } from "~utils/browser"

import BookmarkFavicon from "../BookmarkFavicon"
import { CiTrash } from "react-icons/ci"
import { ReadItLaterStore } from "~store"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect } from "react"

export default function ReadItLater() {
  const [readList, setReadList] = useAtom(ReadItLaterStore)

  useEffect(() => {
    // init read it later list
    const init = async () => {
      const result = await getReadItLaterList()
      setReadList(result)
    }
    init()
  }, [])

  const onRemoveItem = (id: string) => {
    const newList = readList.filter((i) => i.id !== id)
    setReadList(newList)
    removeReadItLaterList(id)
  }

  if (readList.length === 0) return null

  return (
    <div
      style={{ zIndex: EZIndexRecord.readItLater }}
      className="w-[960px] 2xl:w-[1200px] xl:max-w-[60vw] 2xl:max-w-[80vw] min-h-[20vh] p-4 rounded-md flex flex-col items-start fixed top-[30vh] left-0 right-0 mx-auto overflow-hidden">
      <h3 className="heading-8 text-2xl font-bold capitalize text-gray-50 mb-4">
        稍后阅读
      </h3>
      <div className="read-it-later-item max-h-[50vh] overflow-auto p-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {readList.map((i) => (
          <div
            key={i.id}
            onContextMenu={onStopPaClickPropagation}
            className="group relative flex justify-between items-center rounded-md p-2 bg-gray-700 bg-opacity-50 hover:bg-opacity-90 mb-2">
            <div className="flex flex-col justify-between text-left pr-4 text-gray-50 relative gap-2">
              <div className="h-[36px]">
                <span
                  onClick={() => openNewTab(i.url)}
                  className="text-[13px] leading-[18px] line-clamp-2 text-left cursor-pointer">
                  {i.title}
                </span>
              </div>
              <div className="relative flex items-center gap-1">
                {/* <button
                  className="p-1 text-[18px] opacity-50 hover:opacity-100"
                  onClick={() => window.open(i.url, '_blank')}>
                  <LuExternalLink />
                </button> */}
                <span
                  className={clsx(
                    "text-opacity-60 bg-opacity-50 p-0.5 px-1 rounded-sm group-hover:bg-opacity-100 transition-all",
                    {
                      "bg-green-500": i.level === EReadItLaterLevel.later,
                      "bg-yellow-500": i.level === EReadItLaterLevel.urgent,
                      "bg-red-500": i.level === EReadItLaterLevel.important
                    }
                  )}>
                  {i.level ?? "🍵 稍候"}
                </span>
                <button
                  className="p-1 text-[18px] opacity-0 group-hover:opacity-50 hover:opacity-100"
                  onClick={() => onRemoveItem(i.id)}>
                  <CiTrash />
                </button>
              </div>
            </div>
            <BookmarkFavicon
              url={i.url}
              size={32}
              styles={{
                borderRadius: "4px",
                background: "#ffffff40",
                cursor: "pointer"
              }}
              onClick={() => openNewTab(i.url)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
