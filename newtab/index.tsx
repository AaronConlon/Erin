import { useAtom } from "jotai"
import { useEffect, useState } from "react"

import Note from "~components/Note"
import Setting from "~components/Setting"
import Wallpaper from "~components/Wallpaper"
import { currentWallpaperStore, settingConfigStore } from "~store"
import { ENewtabMode, EStorageKey, ISettingConfig } from "~types"
import { onGetCurrentWallpaper } from "~utils/wallpaper"

import "../animation.css"
import "../markdown.css"
import "../radix.css"
import "../style.css"

function Newtab() {
  const [setting, setSetting] = useAtom(settingConfigStore)
  const [hadInit, setHadInit] = useState(false)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)
  useEffect(() => {
    if (hadInit === false) {
      setHadInit(true)
      // init base64 store
      onGetCurrentWallpaper().then((data) => {
        const { base64 } = data
        setCurrentWallpaperBase64(base64)
      })
      // init setting store
      chrome.storage.sync.get(EStorageKey.settingConfig, (result) => {
        const settingConfig = result[
          EStorageKey.settingConfig
        ] as ISettingConfig
        if (!settingConfig["mode"]) {
          settingConfig.mode = ENewtabMode.wallpaper
        }
        setSetting({
          ...settingConfig,
          showWallpaperMarket: false
        })
      })
    } else {
      // save setting to chrome storage
      chrome.storage.sync.set({ [EStorageKey.settingConfig]: setting })
    }
  }, [setting])
  // before init atom data
  if (hadInit === false) return null
  return (
    <Setting>
      {setting.mode === ENewtabMode.wallpaper && <Wallpaper />}
      {setting.mode === ENewtabMode.note && <Note />}
    </Setting>
  )
}

export default Newtab
