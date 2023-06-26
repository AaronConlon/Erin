import { useEffect, useState } from "react"

import { DEFAULT_BING_WALLPAPER_DOMAIN, EStorageKey } from "~types"
import { getBingWeeklyImages } from "~utils/request"
import { getWallpaperBase64FromUrl } from "~utils/wallpaper"

export default function () {
  const [wallpaperUrl, setWallpaperUrl] = useState("")
  useEffect(() => {
    const initWallpaper = async () => {
      const result = await chrome.storage.local.get(
        EStorageKey.currentWallpaper
      )
      console.log(result, result[EStorageKey.currentWallpaper])
      if (result[EStorageKey.currentWallpaper]) {
        setWallpaperUrl(result[EStorageKey.currentWallpaper])
      }
    }
    initWallpaper()
  }, [])
  return (
    <div
      className="relative h-screen bg-cover"
      style={{ background: `url(${wallpaperUrl}) no-repeat` }}>
      <div>wallpaper</div>
    </div>
  )
}
