import { useAtom } from "jotai"

import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"

import Loading from "./Loading"
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
      {isLoading && <Loading />}
      {!settings.showWallpaperMarket && <WallpaperMarket />}
    </div>
  )
}
