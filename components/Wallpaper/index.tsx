import { useAtom } from "jotai"
import { useEffect } from "react"

import TreeNavigation from "~components/TreeNavigation"
import { currentWallpaperStore, settingConfigStore } from "~store"
import { getNewestWallpaper, setDailyNewestWallpaper } from "~utils/wallpaper"

import Bookmarks from "./Bookmarks"
import ReadItLater from "./ReadItLater"
import SearchBar from "./SearchBar"
import WallpaperMarket from "./WallpaperMarket"

export default function () {
  const [currentWallpaperBase64, setCurrentWallpaperBase64] = useAtom(
    currentWallpaperStore
  )
  const [settings] = useAtom(settingConfigStore)
  useEffect(() => {
    // if settings.dailyWallpaper is true, then we need to update the wallpaper
    if (settings.dailyWallpaper) {
      setDailyNewestWallpaper(setCurrentWallpaperBase64)
    }
  }, [settings.dailyWallpaper])
  return (
    <div
      className="relative h-screen bg-cover"
      style={{
        background: `url(${currentWallpaperBase64}) no-repeat`
      }}>
      {settings.showWallpaperMarket && <WallpaperMarket />}
      {settings.showSearchBar && <SearchBar />}
      {settings.showReadItLater && <ReadItLater />}
      {settings.showBrowserTreeNav && <TreeNavigation />}
      {settings.showBookmark && <Bookmarks />}
    </div>
  )
}
