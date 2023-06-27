import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { FcLike, FcLikePlaceholder } from "react-icons/fc"

import useImageList from "~hooks/useImageList"
import { isLoadingWallpaperStore } from "~store"
import { onRightClick } from "~utils/browser"
import {
  generatePreviewWallpaperUrl,
  onReverseLikeWallpaperByUrlbase
} from "~utils/wallpaper"

export default function () {
  const {
    wallpaperList,
    loadMore,
    hadMoreWallpaper,
    setWallpaperList,
    setLikeList,
    likeList,
    updateLikeList,
    type,
    onSwitchType
  } = useImageList()
  const [, setLoading] = useAtom(isLoadingWallpaperStore)

  const containerRef = useRef<HTMLDivElement>(null)
  const [loadRecordMap, setLoadRecordMap] = useState(
    {} as Record<string, boolean>
  )
  const onLoadSuccess = (id: string) => {
    setLoadRecordMap((prev) => ({ ...prev, [id]: true }))
  }

  const onReverseLikeWallpaper = (urlbase: string) => {
    onReverseLikeWallpaperByUrlbase(urlbase)
    setWallpaperList((prev) => {
      return prev.map((item) => {
        if (item.urlbase === urlbase) {
          const like = !item.like
          if (like) {
            setLikeList([...likeList.current, urlbase])
          } else {
            setLikeList(likeList.current.filter((item) => item !== urlbase))
          }
          updateLikeList()
          return { ...item, like: !item.like }
        }
        return item
      })
    })
  }

  useEffect(() => {
    const init = async () => {}
    init()
    // 监听滚动事件，滚动到底部时加载更多
    const onScroll = () => {
      if (!hadMoreWallpaper) return
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current!
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("load more")
        loadMore()
      }
    }
    containerRef.current?.addEventListener("scroll", onScroll)
    return () => {
      containerRef.current?.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      className="w-[1200px] min-h-[520px] max-h-[65vh] max-w-[90vw]  p-4 bg-gray-50 rounded-md fixed left-[50%] top-[50%] transform -translate-x-[50%] -translate-y-[50%] overflow-y-scroll"
      onContextMenu={onRightClick}
      ref={containerRef}>
      {/* tabs */}
      <div className="mb-4 p-1 px-2 grid grid-cols-2 gap-2 bg-gray-200 text-gray-400 rounded-sm max-w-max items-center relative text-center text-[13px]">
        <span className="z-10 pt-[1px]" onClick={() => onSwitchType("all")}>
          全部
        </span>
        <span className="z-10 pt-[1px]" onClick={() => onSwitchType("like")}>
          喜欢
        </span>
        <span
          className={clsx(
            "absolute left-[4px] bottom-[3px] w-[34px] bg-green-50 h-[22px] transition-all",
            {
              "transform translate-x-0": type === "all",
              "transform translate-x-[34px]": type === "like"
            }
          )}></span>
      </div>
      {wallpaperList.length === 0 ? (
        <div className="bg-gray-50 text-gray-400 h-[400px] flex justify-center items-center">
          这儿什么都没有...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {wallpaperList.map(({ urlbase, copyright }) => {
            return (
              <div
                key={urlbase}
                className={clsx("relative", {
                  "animate-pulse bg-gray-100": !loadRecordMap[urlbase]
                })}>
                <img
                  src={generatePreviewWallpaperUrl(urlbase)}
                  onLoad={() => onLoadSuccess(urlbase)}
                  alt=""
                  className={clsx(
                    "w-full h-[214px] object-cover p-1 bg-gray-50 rounded-t-md",
                    {
                      "opacity-0": !loadRecordMap[urlbase]
                    }
                  )}
                />
                <div
                  className={clsx(
                    "absolute bottom-0 left-0 right-0 p-2 bg-gray-900 bg-opacity-50 rounded-md",
                    {
                      "opacity-0": !loadRecordMap[urlbase]
                    }
                  )}>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-50 text-sm max-w-[80%] truncate">
                      {copyright}
                    </div>
                    <div className="text-gray-50 text-sm">
                      {likeList.current?.includes(urlbase) ? (
                        <FcLike
                          onClick={() => onReverseLikeWallpaper(urlbase)}
                        />
                      ) : (
                        <FcLikePlaceholder
                          className="opacity-50"
                          onClick={() => onReverseLikeWallpaper(urlbase)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {hadMoreWallpaper ?? (
            <div className="h-[214px] flex justify-center items-center">
              more
            </div>
          )}
        </div>
      )}
    </div>
  )
}
