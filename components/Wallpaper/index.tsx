import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"

import Bookmarks from "./Bookmarks"
import Loading from "./Loading"
import ReadItLater from "./ReadItLater"
import SearchBar from "./SearchBar"
import TreeNavigation from "~components/TreeNavigation"
import WallpaperMarket from "./WallpaperMarket"
import { useAtom } from "jotai"

export default function () {
  const [currentWallpaperBase64] = useAtom(currentWallpaperStore)
  const [isLoading] = useAtom(isLoadingWallpaperStore)
  const [settings] = useAtom(settingConfigStore)

  return (
    <div
      className="relative h-screen bg-cover"
      style={{
        background: `url(${currentWallpaperBase64}) no-repeat`
      }}>
      {settings.showWallpaperMarket && <WallpaperMarket />}
      {isLoading && <Loading />}
      {settings.showSearchBar && <SearchBar />}
      {settings.showReadItLater && <ReadItLater />}
      {settings.showBrowserTreeNav && <TreeNavigation />}
      {settings.showBookmark && <Bookmarks />}
    </div>
  )
}
