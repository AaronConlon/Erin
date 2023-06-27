import { getResponseCache, setResponseCache } from "./storage"

import { EStorageKey, type IThisWeekData, type IWeekImage } from "~types"
import { endOfToday } from 'date-fns'
import { uniqBy } from "lodash-es"

export const getBingWeeklyImages = async (): Promise<IThisWeekData> => {
  try {
    const url = "https://cn.bing.com/HPImageArchive.aspx?format=js&n=6&uhd=1"
    const cacheData = await getResponseCache(url)
    if (cacheData) return cacheData
    const data = await fetch(url)
    const jsonData = (await data.json()) as IThisWeekData
    // expire time is today 23:59:59 by date-fns
    const expireTime = endOfToday().getTime()
    setResponseCache(url, jsonData, expireTime)
    // save new data into imageList
    const result = await chrome.storage.local.get(EStorageKey.imageList)
    const imageList = result[EStorageKey.imageList] as IWeekImage[] || []
    const newImageList = uniqBy([...imageList, ...jsonData.images], 'urlbase')
    chrome.storage.local.set({
      [EStorageKey.imageList]: newImageList
    })
    return jsonData
  } catch (error) {
    console.log("获取图片失败：", error)
    return {
      images: []
    }
  }
}
