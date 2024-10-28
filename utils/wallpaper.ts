import {
  DEFAULT_BING_WALLPAPER_DOMAIN,
  DEFAULT_WALLPAPER_URL,
  EStorageKey,
  IThisWeekData,
  IWeekImage
} from "~types"

import { generateId } from "./browser"
import { fetchJsonResponse, getBingWeeklyImages } from "./request"

export const generateWallpaperUrl = (urlbase: string) =>
  `${DEFAULT_BING_WALLPAPER_DOMAIN}${urlbase}_UHD.jpg`
export const generatePreviewWallpaperUrl = (urlbase: string) =>
  `${DEFAULT_BING_WALLPAPER_DOMAIN}${urlbase}_1920x1080.jpg`
// cover blob to base64
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

// save current wallpaper's base64 to storage
const saveBase64ToStorage = (base64: string) => {
  chrome.storage.local.set({ [EStorageKey.currentWallpaper]: base64 })
}

export const onDownloadImgBase64 = async (url: string, isRaw = true) => {
  // cache control
  const res = await fetchJsonResponse<Response>(url, { isRaw })
  const blob = await res.blob()
  const base64 = await blobToBase64(blob)
  return base64
}

// get wallpaper's base64 from url
export const getWallpaperBase64FromUrl = async (
  url: string,
  force?: boolean
) => {
  // try {
  //   // if not force, try to get data from cache

  // } catch (error) {
  //   console.log("下载失败：", error, url)
  // }
  if (!force) {
    const cache = await chrome.storage.local.get(EStorageKey.currentWallpaper)
    if (cache[EStorageKey.currentWallpaper]?.url === url) {
      return cache.currentWallpaper.base64
    }
  }
  // fetch from network
  const base64 = await onDownloadImgBase64(url)
  // save to cache
  chrome.storage.local.set({
    [EStorageKey.currentWallpaper]: {
      base64,
      url
    }
  })
  return base64
}

// handle download wallpaper by url
export const onDownloadWallpaperByUrl = (
  url: string,
  format: string = "jpeg"
) => {
  chrome.downloads.download({
    url,
    filename: `Erin-${~~(Math.random() * 10000)}.${format}`
  })
}

// handle download bing wallpaper by urlbase
export const onDownloadBingWallpaperByUrlbase = (urlbase: string) => {
  const url = generateWallpaperUrl(urlbase)
  onDownloadWallpaperByUrl(url)
}

// base64 to blob object
const base64ToBlob = (base64: string) => {
  const mimeType = base64.split(",")[0].match(/:(.*?);/)![1]
  const byteCharacters = atob(base64.split(",")[1])
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType })
}

// handle download current wallpaper
export const onDownloadCurrentWallpaper = async () => {
  const result = await chrome.storage.local.get(EStorageKey.currentWallpaper)
  const base64String = result[EStorageKey.currentWallpaper].base64
  const url = URL.createObjectURL(base64ToBlob(base64String))
  chrome.downloads.download({ url, filename: "current-wallpaper.jpeg" })
}

// handle get current wallpaper info
export const onGetCurrentWallpaper = async () => {
  const result = await chrome.storage.local.get(EStorageKey.currentWallpaper)
  let data = result[EStorageKey.currentWallpaper] as {
    url: string
    base64: string
  }
  // if data is undefined, request default wallpaper
  if (!data) {
    const url = generateWallpaperUrl(DEFAULT_WALLPAPER_URL)
    const base64 = await getWallpaperBase64FromUrl(url)
    // save into storage
    saveBase64ToStorage(base64)
    data = {
      url,
      base64
    }
  }
  return data
}

// handle get current wallpaper index
export const onGetCurrentWallpaperUrlIndex = async (url: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IThisWeekData
  const index = imageListData.images.findIndex((item) => item.urlbase === url)
  return index === -1 ? imageListData.images.length - 1 : index
}

// handle return prev index image, default is prev img
export const onGetPrevOrNextWallpaper = async (url: string, isPrev = true) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IWeekImage[]
  const index = imageListData.findIndex((item) => url.includes(item.urlbase))
  if (isPrev) {
    if (index === 0) {
      return imageListData[imageListData.length - 1]
    }
    return imageListData[index - 1]
  } else {
    if (index === imageListData.length - 1) {
      return imageListData[0]
    }
    return imageListData[index + 1]
  }
}

export const onGetRandomWallpaper = async (url: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = (result[EStorageKey.imageList] as IWeekImage[]).filter(
    (item) => !url.includes(item.urlbase)
  )
  const index = ~~(Math.random() * imageListData.length)
  return imageListData[index]
}

export const onReverseLikeWallpaperByUrlbase = async (urlbase: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IWeekImage[]
  const index = imageListData.findIndex((item) => item.urlbase === urlbase)
  imageListData[index].like = !imageListData[index].like
  chrome.storage.local.set({
    [EStorageKey.imageList]: imageListData
  })
}

// set urlbase to current wallpaper
export const onSetUrlBaseToCurrentWallpaper = async (
  urlbase: string,
  renderCurrentWallpaper: (base64: string) => void
) => {
  const fullUrl = generateWallpaperUrl(urlbase)
  const base64 = await getWallpaperBase64FromUrl(fullUrl)
  chrome.storage.local.set({
    [EStorageKey.currentWallpaper]: {
      url: fullUrl,
      base64
    }
  })
  renderCurrentWallpaper(base64)
}

export const onSetCustomWallpaperToStorage = async (base64: string) => {
  chrome.storage.local.set({
    [EStorageKey.currentWallpaper]: {
      url: "",
      base64
    }
  })
}

// download image by url and format in browser content
export const onDownloadImgByUrlAndFormat = async (
  url: string,
  format: string
) => {
  const base64 = await onDownloadImgBase64(url)
  // Download base64 image in browser
  const a = document.createElement("a")
  a.href = base64
  a.download = `${generateId()}.${format}`
  a.click()
  a.remove()
}

export const getNewestWallpaper = async () => {
  const weeklyWallpaper = await getBingWeeklyImages()
  return weeklyWallpaper.images[0]
}

export const setDailyNewestWallpaper = async (
  callback: (base64: string) => void
) => {
  const { dateRecord } = await chrome.storage.local.get(EStorageKey.dateRecord)
  const todayYYYYMMDD = new Date().toLocaleDateString().replace(/\//g, "")
  if (dateRecord !== todayYYYYMMDD) {
    // update wallpaper and dateRecord
    const { urlbase } = await getNewestWallpaper()
    onSetUrlBaseToCurrentWallpaper(urlbase, (base64) => {
      chrome.storage.local.set({ [EStorageKey.dateRecord]: todayYYYYMMDD })
      callback(base64)
    })
  }
}
