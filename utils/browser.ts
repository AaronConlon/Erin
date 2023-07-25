import { blobToBase64, getWallpaperBase64FromUrl } from "./wallpaper"

import { ESearchEngine } from "~types"
import { sendToBackground } from "@plasmohq/messaging"

export const onStopPaClickPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const onOpenQueryAtNewTab = (value: string, searchEngine: ESearchEngine) => {
  const searchMap = {
    [ESearchEngine.google]: `https://www.google.com/search?q=${value}`,
    [ESearchEngine.baidu]: `https://www.baidu.com/s?wd=${value}`,
    [ESearchEngine.bing]: `https://cn.bing.com/search?q=${value}`,
    [ESearchEngine.youtube]: `https://www.youtube.com/results?search_query=${value}`,
    [ESearchEngine.github]: `https://github.com/search?q=${value}&type=repositories`
    
  }
  window.open(searchMap[searchEngine], '_blank')
}

// tabs array include all tabs in all windows, so we need to resolve a tree structure from it, and return a tree structure.
// Each children tab will has a openerTabId attribute, which is the parent tab id.
// be careful, children tab may be a root tab, so we need to filter them out.
export const resolveTabsTree = (tabs: chrome.tabs.Tab[]) => {
  const rootTabs = tabs.filter(tab => !tab.openerTabId)
  const childrenTabs = tabs.filter(tab => tab.openerTabId)
  const resolve = (tab: chrome.tabs.Tab) => {
    const children = childrenTabs.filter(child => child.openerTabId === tab.id)
    return {
      ...tab,
      children: children.map(resolve)
    }
  }
  return rootTabs.map(resolve)
}

// open target tab by tabId
export const openTab = (tab: chrome.tabs.Tab) => {
  const { id, windowId, index } = tab
  sendToBackground({
    name: 'highlight',
    body: {
      windowId,
      id,
      index
    }
  })
}

// close target tab by tabId
export const closeTab = (tab: chrome.tabs.Tab) => {
  sendToBackground({
    name: 'closeTab',
    body: {
      tab
    }
  })
}

// get image address host from url
export const getImageHost = (url: string, backup: string) => {
  try {
    return new URL(url).host

  } catch (error) {
    return backup
  }
}

// get url base64 in browser 
export const onGetUrlBase64InBrowser = async (url: string, backup?: string) => {
  if (!url || !url?.startsWith('http')) {
    throw Error()
  }
  const res = await fetch(url)
  const blob = await res.blob()
  const base64 = await blobToBase64(blob)
  return base64
}

// generate a random id
export const generateId = () => {
  let result = ''
  for (let index = 0; index < 8; index++) {
    const randomValue = Math.random() * 9
    result += `${~~randomValue}`
  }
  return result
}

// open new tab by url
export const openNewTab = (url: string) => {
  window.open(url, '_blank')
}