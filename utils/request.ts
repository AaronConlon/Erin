import { endOfToday } from "date-fns"
import { uniq, uniqBy } from "lodash-es"

import { EStorageKey, type IThisWeekData, type IWeekImage } from "~types"

import { getResponseCache, setResponseCache } from "./storage"

export const getBingWeeklyImages = async (): Promise<IThisWeekData> => {
  try {
    let mkt = "en-US"
    try {
      const result = await chrome.storage.sync.get("wallpaperMkt")
      mkt = result.wallpaperMkt || mkt
    } catch (error) {
      const result = await chrome.storage.local.get("wallpaperMkt")
      mkt = result.wallpaperMkt || mkt
    }
    const url = `https://cn.bing.com/HPImageArchive.aspx?format=js&n=8&uhd=1&mkt=${mkt}`

    const jsonData = await fetchJsonResponse<IThisWeekData>(url)
    // save new data into imageList
    const result = await chrome.storage.local.get(EStorageKey.imageList)
    const imageList = (result[EStorageKey.imageList] as IWeekImage[]) || []
    const newImageList = uniqBy([...imageList, ...jsonData.images], "urlbase")
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
export const fetchJsonResponse = async <T>(
  url: string,
  options?: RequestInit & { isRaw?: boolean }
) => {
  const cacheData = await getResponseCache<T>(url)
  if (cacheData) {
    // console.log('get data from cache:', cacheData)
    return cacheData
  }
  const res = await fetch(url, options)
  const expireTime = endOfToday().getTime()
  if (options?.isRaw) {
    return res as T
  }
  const jsonData = await res.json()
  setResponseCache(url, jsonData, expireTime)
  return jsonData as Promise<T>
}

// 从必应搜索获取搜索建议，解析出来的数据格式
function extractJsonData(str):
  | null
  | {
      Suggests: {
        Txt: string
      }[]
    }[] {
  const match = str
    .replace(/\/\*.*?\*\//gi, "")
    .match(/window\.bing\.sug\((\{.*\})\)/)
  if (match) {
    const jsonStr = match[1]
    const jsonData = JSON.parse(jsonStr)
    if (jsonData.AS && jsonData.AS.Results && jsonData.AS.Results.length > 0) {
      return jsonData.AS.Results
    } else {
      return null
    }
  } else {
    return null
  }
}

export const getSearchSuggestions = async (query: string) => {
  try {
    const subscriptionKey = process.env.PLASMO_PUBLIC_BING_SEARCH_KEY
    const searchSuggestApiUrl = `http://api.bing.com/qsonhs.aspx?type=cb&q=${query}&cb=window.bing.sug`
    const cache = await getResponseCache(searchSuggestApiUrl)
    if (cache) {
      // console.log('had cache of:', cache)
      return cache
    }
    const response = await fetch(searchSuggestApiUrl, {
      // @ts-ignore
      "Ocp-Apim-Subscription-Key": subscriptionKey
    })
    // raw string is a executable js function
    const rawString = await response.text()
    const results = extractJsonData(rawString)
    const data = uniq(
      results
        .map((i) => i.Suggests)
        .flat()
        .map((i) => i["Txt"])
    )
    setResponseCache(searchSuggestApiUrl, data, endOfToday().getTime())
    return data
  } catch (error) {
    console.log("get bing suggestion fail:", error)
    return []
  }
}
