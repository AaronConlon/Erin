import type { ISettingConfig } from "~types"
import { atom } from "jotai"

export const settingConfigStore = atom({
  mode: 'wallpaper',
  showBookmark: false,
  showWallpaperMarket: false,
  showSearchBar: false,
  hadInit: false
} as ISettingConfig)

export const currentWallpaperStore = atom('')