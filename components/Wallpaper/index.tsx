import { useAtom } from "jotai"
import { useEffect } from "react"

import { currentWallpaperStore, settingConfigStore } from "~store"
import { onGetCurrentWallpaper } from "~utils/wallpaper"

export default function () {
  // const [settingConfig, setSettingConfig] = useAtom(settingConfigStore)
  const [currentWallpaperBase64] = useAtom(currentWallpaperStore)
  // useEffect(() => {
  //   const initWallpaper = async () => {
  //     const { base64 } = await onGetCurrentWallpaper()
  //     // setSettingConfig({ ...settingConfig, currentWallpaperBase64: base64 })
  //     // setTimeout(() => {
  //     //   console.log("settingConfig:", settingConfig)
  //     // }, 300)
  //   }
  //   initWallpaper()
  // }, [])

  return (
    <div
      className="relative h-screen bg-cover"
      style={{
        background: `url(${currentWallpaperBase64}) no-repeat`
      }}>
      <div>wallpaper</div>
    </div>
  )
}
