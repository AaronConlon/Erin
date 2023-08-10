import { useAtom } from "jotai"
import { FC, useState } from "react"
import { AiOutlineEnter, AiOutlinePlus } from "react-icons/ai"
import { CiMap } from "react-icons/ci"

import { syncBookmarksStore } from "~store"
import { EZIndexRecord } from "~types"
import {
  generateId,
  onStopPaClickPropagation,
  openNewTab
} from "~utils/browser"
import { addSyncBookmarks } from "~utils/storage"

import BookmarkFavicon from "./BookmarkFavicon"

interface ISearchItemsProps {
  data: chrome.bookmarks.BookmarkTreeNode[]
}

const SearchItemsContainer: FC<ISearchItemsProps> = ({ data }) => {
  const [bookmarks, setBookmarks] = useAtom(syncBookmarksStore)
  const onAddCustomBookmark = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    if (bookmarks.find((b) => b.id === bookmark.id)) return
    // add bookmark
    setBookmarks([...bookmarks, bookmark])
    addSyncBookmarks({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url
    })
  }

  return (
    <div
      data-white
      style={{ zIndex: EZIndexRecord.bookmarks }}
      className="flex flex-col-reverse gap-2 p-1 max-h-[40vh] overflow-y-auto">
      {data.length === 0 ? (
        <div className="min-h-[100px] text-lg flex items-center justify-center gap-4">
          <CiMap />
          <span>这是一片荒原</span>
        </div>
      ) : (
        data
          .sort((a, b) => a.dateAdded - b.dateAdded)
          .map(({ title, id, url }) => {
            return (
              <div
                onClick={() => openNewTab(url)}
                key={id}
                className="flex gap-4 group hover:bg-gray-100 p-2.5 items-center text-left">
                <BookmarkFavicon url={url} />
                <div className="flex-grow">
                  <div className="truncate max-w-[440px] text-[14px] leading-4 pb-2">
                    {title}
                  </div>
                  <div className="text-[12px] opacity-50 text-left block truncate max-w-[400px]">
                    {url}
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 text-[20px] text-purple-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onAddCustomBookmark({ title, id, url })
                  }}>
                  <AiOutlineEnter />
                </button>
              </div>
            )
          })
      )}
    </div>
  )
}

const AddCustomBookmarkForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [bookmarks, setBookmarks] = useAtom(syncBookmarksStore)
  const onSubmit = () => {
    if (form.title.trim().length === 0 || form.url.trim().length === 0) return
    if (bookmarks.some((i) => i.url === form.url)) return
    if (/^https?:\/\//.test(form.url) === false) {
      form.url = `http://${form.url}`
    }
    setBookmarks([...bookmarks, form])
    addSyncBookmarks(form)
    setForm({
      title: "",
      url: "",
      id: generateId()
    })
  }
  const [form, setForm] = useState({
    title: "",
    url: "",
    id: generateId()
  })
  return (
    <div>
      <div className="flex flex-col gap-2">
        <input
          className="p-2 focus-visible:outline-none border-b border-b-transparent focus:border-blue-200"
          type="text"
          placeholder="标题"
          value={form.title}
          onChange={(e) => {
            const _title = e.target.value
            setForm({
              ...form,
              title: _title
            })
          }}
        />
        <input
          className="p-2 focus-visible:outline-none border-b border-b-transparent focus:border-blue-200"
          type="text"
          placeholder="网址"
          value={form.url}
          onChange={(e) => {
            const _url = e.target.value
            setForm({
              ...form,
              url: _url
            })
          }}
        />
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="mr-2 inline-block w-12 text-center text-primary underline p-1 rounded-sm opacity-60 hover:opacity-100 transition-all">
            取消
          </button>
          <button
            onClick={onSubmit}
            className="mr-2 inline-block w-12 text-center bg-black text-white p-1 rounded-sm opacity-60 hover:opacity-100 transition-all">
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ({ onCloseBox }: { onCloseBox: () => void }) {
  const [showSearch, setShowSearch] = useState(true)
  const [query, setQuery] = useState("")
  const [searchItems, setSearchItems] = useState(
    [] as chrome.bookmarks.BookmarkTreeNode[]
  )

  const onSearch = (_query: string) => {
    // search
    if (_query.trim().length !== 0) {
      chrome.bookmarks.search(_query, (results) => {
        setSearchItems(results.filter((i) => i.url))
      })
    }
  }

  return (
    <div
      style={{
        zIndex: EZIndexRecord.bookmarks
      }}
      className="slideFromTop fixed bottom-[40vh] left-0 right-0 mx-auto w-[600px] bg-gray-50 p-2 rounded-md flex flex-col-reverse gap-4 custom-shadow transform transition-all origin-center"
      onClick={onStopPaClickPropagation}
      onContextMenu={onStopPaClickPropagation}>
      <div className="flex items-center bg-white">
        <input
          type="text"
          className="flex-grow p-3 focus-visible:outline-none text-[16px] leading-[20px]"
          autoFocus
          onKeyUp={(e) => {
            // handler click esc
            if (e.keyCode === 27) onCloseBox()
          }}
          placeholder="搜索..."
          value={query}
          onChange={(e) => {
            const _query = e.target.value
            setQuery(_query)
            onSearch(_query)
          }}
        />
        <button className="p-1" onClick={(e) => setShowSearch(false)}>
          <AiOutlinePlus
            size={24}
            className="transform scale-75 opacity-30 hover:scale-100 transition-all hover:opacity-100 hover:text-purple-500"
          />
        </button>
      </div>
      <div className="bg-white bg-opacity-60 flex-grow p-2 pr-0">
        {showSearch ? (
          <SearchItemsContainer data={searchItems} />
        ) : (
          <AddCustomBookmarkForm onClose={() => setShowSearch(true)} />
        )}
      </div>
    </div>
  )
}
