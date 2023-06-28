import { ESearchEngine, type ISettingConfig } from "~types"
import { atom } from "jotai"

export const DEFAULT_SETTING = {
  mode: 'wallpaper',
  showBookmark: false,
  showWallpaperMarket: false,
  showSearchBar: false,
  hadInit: false,
  searchEngine: ESearchEngine.google
} as ISettingConfig

export const settingConfigStore = atom(DEFAULT_SETTING)

export const currentWallpaperStore = atom('')
export const isLoadingWallpaperStore = atom(false)