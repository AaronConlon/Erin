import { useCallback, useEffect, useRef, useState } from "react";

import { EStorageKey, type IWeekImage } from "~types";
import { onGetCurrentWallpaper } from "~utils/wallpaper";

export default function useImageList() {
  const imgList = useRef([] as IWeekImage[])
  const [type, setType] = useState("all")
  const RANGE = 8
  const limit = useRef(RANGE)
  const [wallpaperList, setWallpaperList] = useState([] as IWeekImage[])
  const [hadMoreWallpaper, setHadMoreWallpaper] = useState(true)
  const likeList = useRef([] as string[])
  const loadMore = useCallback(() => {
    const targetList = imgList.current.filter(item => {
      if (type === 'all') return true
      return likeList.current.includes(item.urlbase)
    })
    if (limit.current < targetList.length) {
      limit.current += RANGE
      console.log(limit.current + RANGE < targetList.length)
      setHadMoreWallpaper(limit.current + RANGE < targetList.length)
      setWallpaperList(targetList.slice(0, limit.current))
    } else {
      console.log('no more')
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
    limit.current = RANGE
    setHadMoreWallpaper(limit.current + RANGE < filterList.length)
    setWallpaperList(filterList.slice(0, limit.current))
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
      setLikeList(_likeList)
      setHadMoreWallpaper(limit.current < imageListData.length)
    }
    init()
  }, [])


  return {
    loadMore, wallpaperList, hadMoreWallpaper, setWallpaperList, likeList, setLikeList,
    updateLikeList,
    type, onSwitchType
  }
}