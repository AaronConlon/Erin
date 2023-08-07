import { useAtom } from "jotai"

import TreeNavigation from "~components/TreeNavigation"
import { currentWallpaperStore, settingConfigStore } from "~store"

import Bookmarks from "./Bookmarks"
import ReadItLater from "./ReadItLater"
import SearchBar from "./SearchBar"
import WallpaperMarket from "./WallpaperMarket"

export default function () {
  const [currentWallpaperBase64] = useAtom(currentWallpaperStore)
  const [settings] = useAtom(settingConfigStore)

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
