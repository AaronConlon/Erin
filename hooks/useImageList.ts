import { useCallback, useEffect, useRef, useState } from "react";

import { EStorageKey, type IWeekImage } from "~types";
import { onGetCurrentWallpaper } from "~utils/wallpaper";

export default function useImageList() {
  const imgList = useRef([] as IWeekImage[])
  const [type, setType] = useState("all")

  const limit = useRef(7)
  const [wallpaperList, setWallpaperList] = useState([] as IWeekImage[])
  const [hadMoreWallpaper, setHadMoreWallpaper] = useState(true)
  const likeList = useRef([] as string[])
  const loadMore = useCallback(() => {
    const targetList = imgList.current.filter(item => {
      if (type === 'all') return true
      return likeList.current.includes(item.urlbase)
    })
    if (limit.current < targetList.length) {
      limit.current += 7
      setHadMoreWallpaper(limit.current + 7 < targetList.length)
      setWallpaperList(targetList.slice(0, limit.current))
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


  const onSwitchType = (newType: 'all' | 'like') => {
    setType(newType)
    const filterList = imgList.current.filter(item => {
      if (newType === 'all') return true
      return likeList.current.includes(item.urlbase)
    })
    limit.current = 7
    setHadMoreWallpaper(limit.current + 7 < filterList.length)
    setWallpaperList(filterList.slice(0, limit.current))
  }


  useEffect(() => {
    // get image list from storage
    const init = async () => {
      const result = await chrome.storage.local.get(EStorageKey.imageList)
      const { url } = await onGetCurrentWallpaper()
      const imageListData = (result[EStorageKey.imageList] as IWeekImage[]).filter(item => !url.includes(item.urlbase))
      // const imageListData = []
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
    updateLikeList,
    type, onSwitchType
  }
}