import { DEFAULT_WALLPAPER_URL, EBgMessageName, EMenuItemId, EStorageKey } from "~types";
import { generateWallpaperUrl, getWallpaperBase64FromUrl } from "~utils/wallpaper";

import { DEFAULT_SETTING } from "~store";
import { addReadItLaterList } from "~utils/storage";
import { getBingWeeklyImages } from "~utils/request";
import { sendToContentScript } from "@plasmohq/messaging";

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

(async () => {
  chrome.contextMenus.create({
    title: "Erin工具包",
    id: "tools"
  })
  chrome.contextMenus.create({
    title: "🔖 添加到待阅读列表",
    parentId: "tools",
    id: EMenuItemId.addCurrentPageToReadItLater   
  })
  chrome.contextMenus.create({
    title: "📖 复制当前页为markdown链接",
    parentId: "tools",
    id: EMenuItemId.copyAsMdLink 
  })

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
    try {
      console.log(info)
      const currentTab = await chrome.tabs.get(tab.id)
      
      
      const {menuItemId} = info
      if(menuItemId === EMenuItemId.addCurrentPageToReadItLater) {
        // get current tab
      const {id, title, url, favIconUrl} = currentTab
       
        // add current page to read it later
        addReadItLaterList({id: `${id}`, title, url, favIconUrl})
      } else if(menuItemId === EMenuItemId.copyAsMdLink) {
        const mdUrl = `[${tab.title}](${tab.url})`
        // navigator.clipboard.writeText(mdUrl)
        sendToContentScript({
          name: EBgMessageName.copyMdTitleText,
          body: {
            text: mdUrl
          }
        })
      }
    } catch (error) {
      console.log('copy current page as markdown link failed', error)
    }
  })
})()