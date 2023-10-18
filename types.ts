

export interface ISettingConfig {
  mode: ENewtabMode
  showWallpaperMarket: boolean
  showBookmark: boolean
  showSearchBar: boolean
  searchEngine: ESearchEngine
  showBrowserTreeNav: boolean
  showReadItLater: boolean
  showClock: boolean
  dailyWallpaper: boolean
  enableHiddenFeature: boolean
  showJable: boolean
  showMissAV: boolean
  showAcg: boolean
  showNaiflix: boolean
}

export interface IBase64ListItem {
  base64: string
  url: string
  timestamp: number
}

export interface IWeekImage {
  startdate: string
  fullstartdate: string
  enddate: string
  urlbase: string
  copyright: string
  like?: boolean
}
export interface IThisWeekData {
  images: IWeekImage[]
}

export const DEFAULT_BING_WALLPAPER_DOMAIN = "https://cn.bing.com"
export const DEFAULT_BING_WEEK_URL =
  "https://cn.bing.com/HPImageArchive.aspx?format=js&n=6&uhd=1"
export const DEFAULT_WALLPAPER_URL =
  "/th?id=OHR.VillandryGarden_EN-CN7756956366"

export enum EStorageKey {
  currentWallpaper = "currentWallpaper",
  settingConfig = "settingConfig",
  imageList = "imageList",
  responseCache = "responseCache",
  likeList = "likeList",
  tabsTree = "tabsTree",
  activatedTabs = "activatedTabs",
  iconCache = "iconCache",
  noteList = "noteList",
  bookmarks = "bookmarks",
  readItLaterList = "readItLaterList",
  asideSettingConfig = "asideSettingConfig",
  dateRecord = "dateRecord"
}

export enum ESearchEngine {
  "google" = "google",
  "bing" = "bing",
  "baidu" = "baidu",
  "youtube" = "youtube",
  "github" = "github"
}

export enum ENavTreeMode {
  newtab = "newtab",
  content = "content",
  popup = "popup"
}

export enum ENewtabMode {
  wallpaper = "wallpaper",
  note = "note"
}

export interface INote {
  title: string
  content: string
  id: string
  color: string
  bgColor: string
  // set position
  left?: string
  top?: string
}

export interface IReadItLaterItem {
  id: string
  title: string
  url: string
  favIconUrl?: string
  level?: string
}

export enum EBgMessageName {
  copyMdContentToClipboard = "copyMdContentToClipboard",
  downloadImgWithFormat = "downloadImgWithFormat",
  applyPicInPicMode = "applyPicInPicMode"
}

export enum EMenuItemId {
  "copyAsMdLink" = "copyAsMdLink",
  "addCurrentPageToReadItLater" = "addCurrentPageToReadItLater",
  "img" = "img",
  "pictureInPicture" = "pictureInPicture"
}

export enum EZIndexRecord {
  readItLater = 100,
  searchBar,
  bookmarks,
  wallpaperMarket,
  fullscreenLayout,
  loadingIcon
}

export enum EReadItLaterLevel {
  important = "🎯 重要",
  urgent = "🚗 紧急",
  later = "🍵 稍后"
}

export enum EContentMenuImgAction {
  "copyImgAsMarkdown" = "🚀 复制为 markdown 图片",
  "downloadCurrentImg" = "⏬ 立即下载",
  "downloadFormat" = "🔃 格式转化下载",
  "downloadAsJPEG" = "JPEG",
  "downloadAsJPG" = "JPG",
  "downloadAsPNG" = "PNG",
  "copyLinkAsMarkdown" = "复制为 markdown 链接"
}

// aside setting config interface
export interface IAsideSettingConfig {
  // basicFontSize: number
  // userInfo: {},
  bookmark: {
    iconSize: number
  }
  searchBar: {
    iconSize: number
  }
  // 快捷键
  shortcut: {
    showWallpaperMarket: string
    showBookmark: string
    selectPrevWallpaper: string
    selectNextWallpaper: string
    showSearchComponent: string
    showTabTree: string
    fullScreen: string
  }
}

export enum EAdultFeatureUrl {
  jableTV = "https://jable.tv/search/__KEYWORD__",
  missAV = "https://www.missav.com/search/__KEYWORD__",
  Naiflix = "https://www.naiflix.com/search/?wd=__KEYWORD__",
  Acg = "https://www.acg.rw/search/__KEYWORD__/"
}