import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { CiMaximize2 } from "react-icons/ci"
import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import { FiDownload } from "react-icons/fi"
import { MdUnfoldMore } from "react-icons/md"

import FullscreenFilterContainer from "~components/FullscreenFilterContainer"
import useImageList from "~hooks/useImageList"
import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"
import { getBingWeeklyImages } from "~utils/request"
import {
  generatePreviewWallpaperUrl,
  onDownloadBingWallpaperByUrlbase,
  onReverseLikeWallpaperByUrlbase,
  onSetUrlbaseToCurrentWallpaper
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
  const [, setSetting] = useAtom(settingConfigStore)
  const [isLoading, setLoading] = useAtom(isLoadingWallpaperStore)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)

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

  const onSetTargetWallpaper = async (urlbase: string) => {
    if (isLoading) return
    try {
      setLoading((v) => !v)
      await onSetUrlbaseToCurrentWallpaper(urlbase, setCurrentWallpaperBase64)
    } catch (error) {
      console.log("set target wallpaper failed. urlbase:", urlbase)
    } finally {
      setLoading((v) => !v)
    }
  }

  useEffect(() => {
    // const init = async () => {}
    // init()
    getBingWeeklyImages()
    // 监听滚动事件，滚动到底部时加载更多
    const onScroll = () => {
      if (!hadMoreWallpaper) return
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current!
      if (scrollTop + clientHeight >= scrollHeight) {
        // console.log("load more")
        loadMore()
      }
    }
    containerRef.current?.addEventListener("scroll", onScroll)
    return () => {
      containerRef.current?.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <FullscreenFilterContainer
      classnames="justify-center backdrop-blur-sm"
      onClickOutside={() => {
        setSetting((prev) => ({ ...prev, showWallpaperMarket: false }))
      }}>
      <div
        className="w-[1200px] min-h-[520px] max-h-[65vh] max-w-[90vw]  p-4 bg-gray-50 rounded-md fixed left-[50%] top-[50%] transform -translate-x-[50%] -translate-y-[50%] overflow-y-scroll"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}>
        {/* tabs */}
        <div className="mb-4 p-1 px-2 grid grid-cols-2 bg-gray-300 text-gray-50 rounded-sm max-w-max items-center justify-center relative text-center text-[13px]">
          <span
            className="w-[40px] z-10 pt-[1px]"
            onClick={() => onSwitchType("all")}>
            全部
          </span>
          <span
            className="w-[40px]  z-10 pt-[1px]"
            onClick={() => onSwitchType("like")}>
            喜欢
          </span>
          <span
            className={clsx(
              "absolute left-[4px] bottom-[3px] w-[45%] bg-gray-600 h-[22px] transition-all",
              {
                "transform translate-x-0": type === "all",
                "transform translate-x-[100%]": type === "like"
              }
            )}></span>
        </div>
        {wallpaperList.length === 0 ? (
          <div className="bg-gray-50 text-gray-400 h-[400px] flex justify-center items-center text-[16px]">
            这儿什么都没有...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {wallpaperList.map(({ urlbase, copyright }) => {
              return (
                <div
                  key={urlbase}
                  className={clsx("relative group", {
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
                      "absolute bottom-0 left-0 right-0 p-2 bg-gray-900 bg-opacity-50 rounded-md  opacity-50 group-hover:opacity-100",
                      {
                        "opacity-0": !loadRecordMap[urlbase]
                      }
                    )}>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-50 text-[12px] max-w-[55%] truncate">
                        {copyright}
                      </div>
                      <div className="text-gray-50 text-sm flex gap-2 cursor-pointer">
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
                        <FiDownload
                          onClick={() =>
                            onDownloadBingWallpaperByUrlbase(urlbase)
                          }>
                          download
                        </FiDownload>
                        <CiMaximize2
                          onClick={() => onSetTargetWallpaper(urlbase)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {hadMoreWallpaper ? (
              <div className="h-[214px] flex justify-center items-center">
                <MdUnfoldMore
                  className="text-2xl opacity-40 hover:text-[32px] transition-all cursor-pointer hover:rotate-90 hover:opacity-100"
                  onClick={loadMore}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </FullscreenFilterContainer>
  )
}
