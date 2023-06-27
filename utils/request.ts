import { getResponseCache, setResponseCache } from "./storage"

import { EStorageKey, type IThisWeekData, type IWeekImage } from "~types"
import { endOfToday } from 'date-fns'
import { uniqBy } from "lodash-es"

export const getBingWeeklyImages = async (): Promise<IThisWeekData> => {
  try {
    const url = "https://cn.bing.com/HPImageArchive.aspx?format=js&n=6&uhd=1"
    const jsonData = await fetchJsonResponse<IThisWeekData>(url)
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

// custom fetch function, add cache support
export const fetchJsonResponse = async <T>(url: string, options?: RequestInit) => {
  if (getResponseCache(url)) {
    return getResponseCache<T>(url)
  }
  const res = await fetch(url, options)
  const expireTime = endOfToday().getTime()
  const jsonData = await res.json()
  setResponseCache(url, jsonData, expireTime)
  return jsonData as Promise<T>
}
