import { EStorageKey, type IWeekImage } from "~types"

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export const getWallpaperBase64FromUrl = async (url: string, force?: boolean) => {
  try {
    if (!force) {
      const cache = await chrome.storage.local.get('currentWallpaper')
      if (cache?.currentWallpaper?.url === url) {
        console.log('cache data')
        return cache.currentWallpaper.base64
      }
    }
    const res = await fetch(url)
    const blob = await res.blob()
    const base64 = await blobToBase64(blob)
    // save to cache
    chrome.storage.local.set({
      currentWallpaper: {
        base64,
        url
      }
    })
    return base64
  } catch (error) {
    console.log("下载失败：", error)
  }
}

export const onDownloadWallpaperByUrl = (url: string) => {
  chrome.downloads.download({
    url,
    filename: `Erin-${~~(Math.random() * 10000)}.jpeg`
  })
}

export const shouldFetchNewData = (timestamp: number) =>
  new Date().toLocaleDateString() !== new Date(timestamp).toLocaleDateString()

export const saveImageListToStorage = (images: IWeekImage[]) => {

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

export const onDownloadCurrentWallpaper = async () => {
  const result = await chrome.storage.local.get(EStorageKey.currentWallpaper)
  const base64String = result[EStorageKey.currentWallpaper]
  console.log(base64String)
  const url = URL.createObjectURL(base64ToBlob(base64String))
  chrome.downloads.download({ url, filename: 'current-wallpaper.jpeg' })
}
