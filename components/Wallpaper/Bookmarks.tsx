import { useAtom } from "jotai"
import { DragEvent, FC, useEffect, useState } from "react"
import { FcFullTrash, FcPlus } from "react-icons/fc"

import { asideSettingConfigStore, syncBookmarksStore } from "~store"
import { onStopPaClickPropagation, openNewTab } from "~utils/browser"
import { getSyncBookmarks, removeSyncBookmarks } from "~utils/storage"

import BookmarkFavicon from "./BookmarkFavicon"
import SearchBookmarks from "./SearchBookmarks"

interface IBookmarkProps {
  data: chrome.bookmarks.BookmarkTreeNode
  setIsDrag: (isDrag: boolean) => void
}

interface IAddCustomBookmarkProps {
  onClick: () => void
}

const Bookmark: FC<IBookmarkProps> = ({ data, setIsDrag }) => {
  const onDragStart = (e: DragEvent<HTMLElement>) => {
    setIsDrag(true)
    e.dataTransfer.setData("text/plain", data.url)
  }

  const onDragEnd = (e: DragEvent<HTMLElement>) => {
    setIsDrag(false)
    e.preventDefault()
  }

  return (
    <div
      data-bookmarks
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-url={data.url}
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

const Trash: FC<{ onRemoveBookmark: (url: string) => void }> = ({
  onRemoveBookmark
}) => {
  const onDrop = (e: DragEvent<HTMLSpanElement>) => {
    console.log("on drop...")
    // console.log(e)
    e.preventDefault()
    console.log(e.dataTransfer.getData("text"))
    const targetUrl = e.dataTransfer.getData("text")
    const target = document.querySelector(`[data-url="${targetUrl}"]`)
    // 不知道为什么不触发动画结束事件
    // target?.addEventListener(
    //   "animationend",
    //   () => {
    //     console.log("animation end...")
    //     target?.remove()
    //     onRemoveBookmark(targetUrl)
    //   },
    //   { once: true }
    // )
    target?.classList.add("remove-bookmark")
    setTimeout(() => {
      onRemoveBookmark(targetUrl)
    }, 600)
  }
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{ boxShadow: "0 0 5px 2.5px white" }}
      className="rounded-md p-1 inline-block">
      <FcFullTrash size={24} />
    </div>
  )
}

export default function () {
  const [showSearch, setShowSearch] = useState(false)
  const [syncBookmarks, setSyncBookmarks] = useAtom(syncBookmarksStore)
  const [asideSettingConfig] = useAtom(asideSettingConfigStore)
  const [isDragging, setIsDragging] = useState(false)
  const onRemoveBookmark = (url: string) => {
    console.log("remove bookmark...", url)
    setSyncBookmarks(
      syncBookmarks.filter((i) => {
        if (i.url !== url) {
          return true
        }
        removeSyncBookmarks(i.id)
        return false
      })
    )
  }
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
        style={{
          boxShadow: "0 30px 60px -12px #fdfdfdeb, 0 18px 36px -18px #0000004d",
          scale: `${asideSettingConfig.bookmark.iconSize / 24}`
        }}
        className="flex items-center gap-3 max-w-max min-w-[200px] flex-wrap bg-black bg-opacity-20 min-h-48 p-3 px-4 fixed bottom-2 mx-auto left-0 right-0 rounded-md hover:scale-105 transition-all origin-bottom z-50">
        {syncBookmarks.map((i) => (
          <Bookmark setIsDrag={setIsDragging} data={i} key={i.id} />
        ))}
        {syncBookmarks.length > 0 && (
          <span className="h-8 bg-gray-300 w-[1px] mx-2"></span>
        )}
        {isDragging ? (
          <Trash onRemoveBookmark={onRemoveBookmark} />
        ) : (
          <AddCustomBookmark onClick={() => setShowSearch(!showSearch)} />
        )}
      </div>
      {showSearch && (
        <SearchBookmarks onCloseBox={() => setShowSearch(false)} />
      )}
    </div>
  )
}
