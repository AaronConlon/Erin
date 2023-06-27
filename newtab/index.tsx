import "../style.css"
import "../radix.css"

import { useAtom } from "jotai"
import { useEffect } from "react"

import Setting from "~components/Setting"
import Wallpaper from "~components/Wallpaper"
import { currentWallpaperStore, settingConfigStore } from "~store"
import { EStorageKey } from "~types"
import { onGetCurrentWallpaper } from "~utils/wallpaper"

function Newtab() {
  const [setting, setSetting] = useAtom(settingConfigStore)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)
  useEffect(() => {
    if (setting.hadInit === false) {
      onGetCurrentWallpaper().then(({ base64 }) => {
        setCurrentWallpaperBase64(base64)
      })
      chrome.storage.sync.get(EStorageKey.settingConfig, (result) => {
        const settingConfig = result[EStorageKey.settingConfig]
        setSetting({ ...settingConfig, hadInit: true })
      })
    } else {
      // save setting to chrome storage
      chrome.storage.sync.set({ [EStorageKey.settingConfig]: setting })
    }
  }, [setting])
  // before init atom data
  if (setting.hadInit === false) return null
  return (
    <Setting>
      <Wallpaper />
    </Setting>
  )
}

export default Newtab