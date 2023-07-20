import { useAtom } from "jotai"

import TreeNavigation from "~components/TreeNavigation"
import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"

import Bookmarks from "./Bookmarks"
import Loading from "./Loading"
import SearchBar from "./SearchBar"
import WallpaperMarket from "./WallpaperMarket"

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
      {settings.showBrowserTreeNav && <TreeNavigation />}
      {settings.showBookmark && <Bookmarks />}
    </div>
  )
}
