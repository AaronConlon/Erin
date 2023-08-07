import { atom } from "jotai"

import {
  ENewtabMode,
  ESearchEngine,
  IReadItLaterItem,
  ISettingConfig
} from "~types"

export const DEFAULT_SETTING = {
  mode: ENewtabMode.wallpaper,
  showBookmark: false,
  showWallpaperMarket: false,
  showSearchBar: false,
  hadInit: false,
  searchEngine: ESearchEngine.google,
  showBrowserTreeNav: false,
  showReadItLater: false,
  showClock: false
} as ISettingConfig

export const settingConfigStore = atom(DEFAULT_SETTING)

export const currentWallpaperStore = atom("")
export const ReadItLaterStore = atom([] as IReadItLaterItem[])

export const syncBookmarksStore = atom(
  [] as chrome.bookmarks.BookmarkTreeNode[]
)

export const showAsideSettingStore = atom(false)
