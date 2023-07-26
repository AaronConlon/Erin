import { ENewtabMode, ESearchEngine, IReadItLaterItem, type ISettingConfig } from "~types"
import { atom } from "jotai"

export const DEFAULT_SETTING = {
  mode: ENewtabMode.wallpaper,
  showBookmark: false,
  showWallpaperMarket: false,
  showSearchBar: false,
  hadInit: false,
  searchEngine: ESearchEngine.google,
  showBrowserTreeNav: false,
  showReadItLater: false,
} as ISettingConfig

export const settingConfigStore = atom(DEFAULT_SETTING)

export const currentWallpaperStore = atom('')
export const isLoadingWallpaperStore = atom(false)
export const ReadItLaterStore = atom([] as IReadItLaterItem[])

export const syncBookmarksStore = atom([] as chrome.bookmarks.BookmarkTreeNode[])