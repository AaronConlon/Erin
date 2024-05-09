import { DEFAULT_WALLPAPER_URL, EStorageKey } from "~types";
import { generateWallpaperUrl, getWallpaperBase64FromUrl } from "~utils/wallpaper";

import { DEFAULT_SETTING } from "~store";
import initContextMenu from "~utils/contextmenu";
import { getBingWeeklyImages } from "~utils/request";

// fetch init data when plugin installed
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

// init created logic
chrome.tabs.onCreated.addListener(
  async (tab: chrome.tabs.Tab) => {
    const { id } = tab
    // get data from storage, update new data
    const result = await chrome.storage.local.get(EStorageKey.tabsTree)
    const { tabsTree = {} } = result
    // key is openerTabId, value is children tab id
    tabsTree[id] = []
    // save data to storage
    chrome.storage.local.set({ tabsTree })
  }
)

// update tab relation record
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const result = await chrome.storage.local.get(EStorageKey.tabsTree)
  const { tabsTree = {} } = result
  const parentTabId = Object.keys(tabsTree).find(key => tabsTree[key].includes(tabId))
  // clear old data
  if (parentTabId) {
    tabsTree[parentTabId] = tabsTree[parentTabId].filter(id => id !== tabId)
  }
  tabsTree[tabId] = undefined
  chrome.storage.local.set({ tabsTree })
});

// define contextmenu item
initContextMenu()