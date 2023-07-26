

export interface ISettingConfig {
  mode: ENewtabMode,
  showWallpaperMarket: boolean,
  showBookmark: boolean
  showSearchBar: boolean
  searchEngine: ESearchEngine
  showBrowserTreeNav: boolean
  showReadItLater: boolean
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

export const DEFAULT_BING_WALLPAPER_DOMAIN = 'https://cn.bing.com'
export const DEFAULT_BING_WEEK_URL = "https://cn.bing.com/HPImageArchive.aspx?format=js&n=6&uhd=1"
export const DEFAULT_WALLPAPER_URL = "/th?id=OHR.VillandryGarden_EN-CN7756956366"

export enum EStorageKey {
  currentWallpaper = 'currentWallpaper',
  settingConfig = 'settingConfig',
  imageList = 'imageList',
  responseCache = 'responseCache',
  likeList = 'likeList',
  tabsTree = 'tabsTree',
  activatedTabs = 'activatedTabs',
  iconCache = 'iconCache',
  noteList = 'noteList',
  bookmarks = 'bookmarks',
  readItLaterList = 'readItLaterList',
}

export enum ESearchEngine {
  'google' = 'google',
  'bing' = 'bing',
  'baidu' = 'baidu',
  'youtube' = 'youtube',
  'github' = 'github',
}

export enum ENavTreeMode {
  newtab = 'newtab',
  content = 'content',
  popup = 'popup'
}

export enum ENewtabMode {
  wallpaper = "wallpaper",
  note = "note"
}

export interface INote {
  title: string,
  content: string,
  id: string,
  color: string,
  bgColor: string,
  // set position
  left?: string;
  top?: string;
}

export interface IReadItLaterItem {
  id: string,
  title: string,
  url: string,
  favIconUrl?: string
}

export enum EBgMessageName {
  copyMdTitleText = 'copyMdTitleText',
}

export enum EMenuItemId {
  'copyAsMdLink' = 'copyAsMdLink',
  'addCurrentPageToReadItLater' = 'addCurrentPageToReadItLater',
}

export enum EZIndexRecord {
  readItLater = 99,
  searchBar = 100,
  loadingIcon,
}