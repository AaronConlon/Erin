import "../animation.css"
import "../markdown.css"
import "../radix.css"
import "../style.css"

import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import AsideSetting from "~components/AsideSetting"
import Clock from "~components/Clock"
import Note from "~components/Note"
import Setting from "~components/Setting"
import Wallpaper from "~components/Wallpaper"
import {
  asideSettingConfigStore,
  currentWallpaperStore,
  settingConfigStore
} from "~store"
import { ENewtabMode, EStorageKey, ISettingConfig } from "~types"
import { getConfigLocalAsideSetting } from "~utils/storage"
import { onGetCurrentWallpaper } from "~utils/wallpaper"

function Newtab() {
  const [setting, setSetting] = useAtom(settingConfigStore)
  const [hadInit, setHadInit] = useState(false)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)
  const [, setAdeSettingConfig] = useAtom(asideSettingConfigStore)

  useEffect(() => {
    if (hadInit === false) {
      getConfigLocalAsideSetting().then((config) => {
        setAdeSettingConfig(config)
      })
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
      setTimeout(() => {
        setHadInit(true)
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
      <Toaster />
      {setting.mode === ENewtabMode.wallpaper && <Wallpaper />}
      {setting.mode === ENewtabMode.note && <Note />}
      <AsideSetting />
      <Clock />
    </Setting>
  )
}

export default Newtab
