import { useCallback, useEffect, useRef, useState } from "react";

import { EStorageKey, type IWeekImage } from "~types";
import { onGetCurrentWallpaper } from "~utils/wallpaper";

export default function useImageList() {
  const imgList = useRef([] as IWeekImage[])
  const limit = useRef(7)
  const [wallpaperList, setWallpaperList] = useState([] as IWeekImage[])
  const [hadMoreWallpaper, setHadMoreWallpaper] = useState(true)
  const likeList = useRef([] as string[])
  const loadMore = useCallback(() => {
    if (limit.current < imgList.current.length) {
      limit.current += 7
      setHadMoreWallpaper(limit.current + 7 < imgList.current.length)
      setWallpaperList(imgList.current.slice(0, limit.current))
    } else {
      setHadMoreWallpaper(false)
    }
  }, [])

  const setLikeList = (list: string[]) => {
    likeList.current = list
  }
  const updateLikeList = () => {
    console.log(likeList)
    chrome.storage.sync.set({
      [EStorageKey.likeList]: likeList.current
    })
  }

  useEffect(() => {
    // get image list from storage
    const init = async () => {
      const result = await chrome.storage.local.get(EStorageKey.imageList)
      const { url } = await onGetCurrentWallpaper()
      const imageListData = (result[EStorageKey.imageList] as IWeekImage[]).filter(item => !url.includes(item.urlbase))
      imgList.current = imageListData
      setWallpaperList(imageListData.slice(0, limit.current))
      const syncResult = await chrome.storage.sync.get(EStorageKey.likeList)
      const _likeList = (syncResult[EStorageKey.likeList] ?? []) as string[]
      console.log('syncResult', syncResult)
      setLikeList(_likeList)
    }
    init()
  }, [])


  return {
    loadMore, wallpaperList, hadMoreWallpaper, setWallpaperList, likeList, setLikeList,
    updateLikeList
  }
}