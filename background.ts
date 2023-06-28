import { DEFAULT_WALLPAPER_URL, EStorageKey } from "~types";
import { generateWallpaperUrl, getWallpaperBase64FromUrl } from "~utils/wallpaper";

import { DEFAULT_SETTING } from "~store";
import { getBingWeeklyImages } from "~utils/request";

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // 在插件首次安装时执行一次的代码
    getBingWeeklyImages()
      .then(async (data) => {
        // fetch a image base64 and save to storage
        const DEFAULT_WALLPAPER = generateWallpaperUrl(DEFAULT_WALLPAPER_URL)
        const imageData = data.images?.[0]
        const url = imageData ? generateWallpaperUrl(imageData.urlbase) : DEFAULT_WALLPAPER
        return {
          base64: await getWallpaperBase64FromUrl(url, true),
          url
        }
      })
      .then(({ base64, url }) => {
        chrome.storage.local.set({
          [EStorageKey.currentWallpaper]: {
            base64,
            url
          }
        })
        // init setting config
        chrome.storage.sync.set(
          {
            [EStorageKey.settingConfig]: DEFAULT_SETTING
          }
        )
      })
  }
});