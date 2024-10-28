import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { CiTrash } from "react-icons/ci"

import { ReadItLaterStore } from "~store"
import { EReadItLaterLevel, EZIndexRecord } from "~types"
import { onStopPaClickPropagation, openNewTab } from "~utils/browser"
import { getReadItLaterList, removeReadItLaterList } from "~utils/storage"

import BookmarkFavicon from "../BookmarkFavicon"

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
      className="lg:w-[960px] 2xl:w-[1200px] xl:max-w-[60vw] 2xl:max-w-[80vw] min-h-[20vh] p-4 rounded-md flex flex-col items-start fixed top-[20vh] left-0 right-0 mx-auto overflow-hidden">
      <h3 className="mb-4 text-2xl font-bold capitalize heading-8 text-gray-50">
        稍后阅读
      </h3>
      <div className="read-it-later-item max-h-[50vh] overflow-auto p-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {readList.map((i) => (
          <div
            key={i.id}
            onContextMenu={onStopPaClickPropagation}
            className="relative flex items-center justify-between p-2 rounded-md group backdrop-blur-[3px] hover:backdrop-blur-md transition-all border border-gray-50/10 hover:border-gray-50/20 z-10">
            <div
              className="relative flex flex-col justify-between gap-2 pr-4 text-left text-gray-50"
              style={{
                maxWidth: "calc(100% - 32px)"
              }}>
              <div
                onClick={() => openNewTab(i.url)}
                className="text-[13px] leading-[18px] line-clamp-2 text-left cursor-pointer h-[36px]">
                {i.title}
              </div>
              <div className="relative flex items-center gap-1">
                <span
                  className={clsx(
                    "text-opacity-60 p-0.5 px-1 rounded-sm",
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
                cursor: "pointer",
                overflow: 'hidden',
                backgroundColor: '#eeeeee',
                padding: '1px'
              }}
              onClick={() => openNewTab(i.url)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
