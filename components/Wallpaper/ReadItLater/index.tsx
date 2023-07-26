import { useAtom } from "jotai"
import { useEffect } from "react"
import { CiTrash } from "react-icons/ci"
import { LuExternalLink } from "react-icons/lu"

import { ReadItLaterStore } from "~store"
import { EZIndexRecord } from "~types"
import { getReadItLaterList, removeReadItLaterList } from "~utils/storage"

import BookmarkFavicon from "../BookmarkFavicon"

export default function ReadItLater() {
  const [readList, setReadList] = useAtom(ReadItLaterStore)

  useEffect(() => {
    // init read it later list
    const init = async () => {
      const result = await getReadItLaterList()
      console.log(result)
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
      className="w-[960px] max-w-[60vw] min-h-[20vh] max-h-[50vh] bg-white bg-opacity-30 p-4 rounded-md flex flex-col items-start fixed top-[30vh] left-0 right-0 mx-auto">
      <h3 className="heading-8 text-2xl font-bold capitalize text-gray-700 mb-4">
        稍后阅读
      </h3>
      <div className="read-it-later-item">
        {readList.map((i) => (
          <div
            key={i.url}
            className="group relative flex justify-between items-center rounded-md p-2 bg-opacity-10 bg-gray-900 mb-2 w-[24%]">
            <div className="flex w-[152px] flex-col text-left pr-4 text-gray-50 relative">
              <p className="text-[13px] leading-[18px] mb-1">{i.title}</p>
              <div className="relative">
                <button
                  className="p-1 text-[18px] opacity-50 hover:opacity-100"
                  onClick={() => onRemoveItem(i.id)}>
                  <LuExternalLink />
                </button>
                <button
                  className="p-1 text-[18px] opacity-0 group-hover:opacity-50 hover:opacity-100"
                  onClick={() => onRemoveItem(i.id)}>
                  <CiTrash />
                </button>
              </div>
            </div>
            {/* <img
              src={i.favIconUrl}
              className="min-w-[36px] max-w-[36px] h-[36px] rounded-md p-1 ml-auto bg-white bg-opacity-20"
            /> */}
            <BookmarkFavicon
              url={new URL(i.favIconUrl).origin}
              bgColor=""
              size={32}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
