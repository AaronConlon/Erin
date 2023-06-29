import { ESearchEngine } from "~types"
import { blobToBase64 } from "./wallpaper"
import { sendToBackground } from "@plasmohq/messaging"
export const onRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const onOpenQueryAtNewTab = (value: string, searchEngine: ESearchEngine) => {
  if (searchEngine === "google") {
    window.open(`https://www.google.com/search?q=${value}`)
  } else if (searchEngine === "baidu") {
    window.open(`https://www.baidu.com/s?wd=${value}`)
  } else {
    // is bing search
    window.open(`https://cn.bing.com/search?q=${value}`)
  }
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