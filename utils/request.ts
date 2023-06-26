import { getResponseCache, setResponseCache } from "./storage"

import type { IThisWeekData } from "~types"
import { endOfToday } from 'date-fns'

export const getBingWeeklyImages = async (): Promise<IThisWeekData> => {
  try {
    const url = "https://cn.bing.com/HPImageArchive.aspx?format=js&n=6&uhd=1"
    const cacheData = await getResponseCache(url)
    console.log('cacheData', cacheData)
    if (cacheData) return cacheData
    const data = await fetch(url)
    const jsonData = await data.json()
    console.log(jsonData)
    // expire time is today 23:59:59 by date-fns
    const expireTime = endOfToday().getTime()
    setResponseCache(url, jsonData, expireTime)
    return jsonData
  } catch (error) {
    console.log("获取图片失败：", error)
    return {
      images: []
    }
  }
}
