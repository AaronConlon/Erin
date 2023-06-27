

export interface ISettingConfig {
  mode: string,
  showWallpaperMarket: boolean,
  showBookmark: boolean
  showSearchBar: boolean
  hadInit: boolean
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

export enum EStorageKey {
  currentWallpaper = 'currentWallpaper',
  settingConfig = 'settingConfig',
  imageList = 'imageList',
  responseCache = 'responseCache',
  likeList = 'likeList'
}