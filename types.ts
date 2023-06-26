export enum ESettingMode {
  plain,
  image
}

export interface ISettingConfig {
  mode: ESettingMode,
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
}
export interface IThisWeekData {
  images: IWeekImage[]
}

export const DEFAULT_BING_WALLPAPER_DOMAIN = 'https://cn.bing.com'

export enum EStorageKey {
  currentWallpaper = 'currentWallpaper',
  settingConfig = 'settingConfig',
  imageList = 'imageList',
  responseCache = 'responseCache'
}