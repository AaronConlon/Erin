import { EStorageKey, type IThisWeekData } from "~types"

// cover blob to base64
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

// get wallpaper's base64 from url
export const getWallpaperBase64FromUrl = async (url: string, force?: boolean) => {
  try {
    // if not force, try to get data from cache
    if (!force) {
      const cache = await chrome.storage.local.get(EStorageKey.currentWallpaper)
      if (cache[EStorageKey.currentWallpaper].url === url) {
        return cache.currentWallpaper.base64
      }
    }
    // fetch from network
    const res = await fetch(url)
    const blob = await res.blob()
    const base64 = await blobToBase64(blob)
    // save to cache
    chrome.storage.local.set({
      [EStorageKey.currentWallpaper]: {
        base64,
        url
      }
    })
    return base64
  } catch (error) {
    console.log("下载失败：", error)
  }
}


// handle download wallpaper by url
export const onDownloadWallpaperByUrl = (url: string) => {
  chrome.downloads.download({
    url,
    filename: `Erin-${~~(Math.random() * 10000)}.jpeg`
  })
}


// base64 to blob object
const base64ToBlob = (base64: string) => {
  const mimeType = base64.split(',')[0].match(/:(.*?);/)![1]
  const byteCharacters = atob(base64.split(',')[1])
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
  chrome.downloads.download({ url, filename: 'current-wallpaper.jpeg' })
}

// handle get current wallpaper info
export const onGetCurrentWallpaper = async () => {
  const result = await chrome.storage.local.get(EStorageKey.currentWallpaper)
  return result[EStorageKey.currentWallpaper] as { url: string, base64: string }
}

// handle get current wallpaper index
export const onGetCurrentWallpaperUrlIndex = async (url: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IThisWeekData
  const index = imageListData.images.findIndex(item => item.urlbase === url)
  return index
}

// handle return prev index image
export const onGetPrevWallpaper = async (url: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IThisWeekData
  const index = imageListData.images.findIndex(item => item.urlbase === url)
  if (index === 0) {
    return imageListData.images[imageListData.images.length - 1]
  }
  return imageListData.images[index - 1]
}

// handle return next index image
export const onGetNextWallpaper = async (url: string) => {
  const result = await chrome.storage.local.get(EStorageKey.imageList)
  const imageListData = result[EStorageKey.imageList] as IThisWeekData
  const index = imageListData.images.findIndex(item => item.urlbase === url)
  if (index === imageListData.images.length - 1) {
    return imageListData.images[0]
  }
  return imageListData.images[index + 1]
}