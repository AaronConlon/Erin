import { EReadItLaterLevel, EZIndexRecord } from "~types"
import { getReadItLaterList, removeReadItLaterList } from "~utils/storage"

import { CiTrash } from "react-icons/ci"
import { ReadItLaterStore } from "~store"
import clsx from "clsx"
import { onStopPaClickPropagation } from "~utils/browser"
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
      className="w-[960px] max-w-[60vw] min-h-[20vh] p-4 rounded-md flex flex-col items-start fixed top-[30vh] left-0 right-0 mx-auto">
      <h3 className="heading-8 text-2xl font-bold capitalize text-gray-50 mb-4">
        稍后阅读
      </h3>
      <div className="read-it-later-item max-h-[50vh] overflow-auto pr-2 pb-24">
        {readList.map((i) => (
          <div
            key={i.id}
            onContextMenu={onStopPaClickPropagation}
            className="group relative flex justify-between items-center rounded-md p-2 bg-gray-700 bg-opacity-50 hover:bg-opacity-90 mb-2">
            <div className="flex flex-col justify-between text-left pr-4 text-gray-50 relative gap-2 min-w-[150px]">
              <div className="h-[36px]">
                <a href={i.url} target="_blank" className="text-[13px] leading-[18px] line-clamp-2">{i.title}</a>
              </div>
              <div className="relative flex items-center gap-1">
                {/* <button
                  className="p-1 text-[18px] opacity-50 hover:opacity-100"
                  onClick={() => window.open(i.url, '_blank')}>
                  <LuExternalLink />
                </button> */}
                <span className={clsx("text-opacity-60 bg-opacity-50 p-0.5 px-1 rounded-sm group-hover:bg-opacity-100 transition-all", {
                  "bg-green-500": i.level === EReadItLaterLevel.later,
                  "bg-yellow-500": i.level === EReadItLaterLevel.urgent,
                  "bg-red-500": i.level === EReadItLaterLevel.important
                })}>{i.level ?? '🍵 稍候'}</span>
                <button
                  className="p-1 text-[18px] opacity-0 group-hover:opacity-50 hover:opacity-100"
                  onClick={() => onRemoveItem(i.id)}>
                  <CiTrash />
                </button>
              </div>
            </div>
            <img
              src={i.favIconUrl}
              className="min-w-[36px] max-w-[36px] h-[36px] rounded-md p-1 ml-auto bg-white bg-opacity-50 transition-all group-hover:rotate-6 group-hover:bg-opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
