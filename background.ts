import { DEFAULT_BING_WALLPAPER_DOMAIN, EStorageKey } from "~types";

import { getBingWeeklyImages } from "~utils/request";
import { getWallpaperBase64FromUrl } from "~utils/wallpaper";

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // 在插件首次安装时执行一次的代码
    getBingWeeklyImages()
      .then(async (data) => {
        // fetch a image base64 and save to storage
        const DEFAULT_WALLPAPER = `${DEFAULT_BING_WALLPAPER_DOMAIN}/th?id=OHR.VillandryGarden_EN-CN7756956366_UHD.jpg`
        const imageData = data.images?.[0]
        const url = imageData ? `${DEFAULT_BING_WALLPAPER_DOMAIN}${imageData.urlbase}_UHD.jpg` : DEFAULT_WALLPAPER
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
            [EStorageKey.settingConfig]: {
              mode: 'wallpaper',
              showBookmark: false,
              showWallpaperMarket: false,
              showSearchBar: false,
              hadInit: false
            }
          }
        )
      })
  }
});