import { useAtom } from "jotai"
import { FC, useEffect, useState } from "react"
import { FcPlus } from "react-icons/fc"

import { syncBookmarksStore } from "~store"
import { onStopPaClickPropagation, openNewTab } from "~utils/browser"
import { getSyncBookmarks } from "~utils/storage"

import BookmarkFavicon from "./BookmarkFavicon"
import SearchBookmarks from "./SearchBookmarks"

interface IBookmarkProps {
  data: chrome.bookmarks.BookmarkTreeNode
}

interface IAddCustomBookmarkProps {
  onClick: () => void
}

const Bookmark: FC<IBookmarkProps> = ({ data }) => {
  return (
    <div
      data-bookmarks
      className="hover-bookmark flex justify-center items-center p-1 bg-gray-50 rounded-md relative group"
      onClick={() => openNewTab(data.url)}>
      <BookmarkFavicon url={data.url} size={24} />
      <span className="absolute bg-black bg-opacity-25 p-1 opacity-0 group-hover:opacity-100 max-w-[96px] truncate text-[12px] rounded-sm -top-[32px] text-white z-[-1]">
        {data.title}
      </span>
    </div>
  )
}
const AddCustomBookmark: FC<IAddCustomBookmarkProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="opacity-50 hover:opacity-100">
      <FcPlus size={28} />
    </button>
  )
}

export default function () {
  const [showSearch, setShowSearch] = useState(false)
  const [syncBookmarks, setSyncBookmarks] = useAtom(syncBookmarksStore)

  useEffect(() => {
    const onClickDoc = () => {
      setShowSearch(false)
    }

    const init = async () => {
      try {
        const syncLocalResult = await getSyncBookmarks()
        setSyncBookmarks(syncLocalResult)
      } catch (error) {
        console.log("get tree failed...", error)
      } finally {
        document.addEventListener("click", onClickDoc)
      }
    }
    init()

    return () => {
      document.removeEventListener("click", onClickDoc)
    }
  }, [])
  return (
    <div onClick={onStopPaClickPropagation}>
      <div
        onContextMenu={onStopPaClickPropagation}
        className="flex items-center gap-3 max-w-max min-w-[600px] flex-wrap bg-black bg-opacity-20 min-h-48 p-3 px-4 fixed bottom-2 mx-auto left-0 right-0 rounded-md custom-shadow hover:scale-105 transition-all origin-bottom z-50">
        {syncBookmarks.map((i) => (
          <Bookmark data={i} key={i.id} />
        ))}
        {syncBookmarks.length > 0 && (
          <span className="h-8 bg-gray-300 w-[1px] mx-2"></span>
        )}
        <AddCustomBookmark onClick={() => setShowSearch(!showSearch)} />
      </div>
      {showSearch && (
        <SearchBookmarks onCloseBox={() => setShowSearch(false)} />
      )}
    </div>
  )
}
