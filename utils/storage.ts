import type { IBase64ListItem, IWeekImage } from "~types"

import { uniqBy } from 'lodash-es'

export const updateData = async <T>(key: string, value: T) => {
  try {
    await chrome.storage.local.set({ [key]: value })
  } catch (error) {
    console.log("更新数据失败：", error, { key, value })
  }
}

export const saveBase64ImgToStorage = async (base64: string, url: string) => {
  try {
    const result = {
      base64,
      url,
      timestamp: Date.now()
    }
    const { base64List = [] } = await chrome.storage.local.get('base64List')
    // remove all expired data
    const newBase64List = base64List.filter((item: IBase64ListItem) => {
      return item.timestamp + 6 * 24 * 60 * 60 * 1000 > Date.now()
    })
    // add new data
    newBase64List.push(result)
    await chrome.storage.local.set({ base64List: newBase64List })
  } catch (error) {
    console.log("保存图片失败：", error)
  }
}

export const saveCurrentWeeklyImagesToStorage = async (images: IWeekImage[]) => {
  try {
    const { bingImages = [] } = await chrome.storage.local.get('bingImages')
    // add new data
    bingImages.push(...images)
    const newRecord = uniqBy(bingImages, (i: IWeekImage) => i.urlbase)
    await chrome.storage.local.set({ bingImages: newRecord })
  } catch (error) {
    console.log("保存图片失败：", error)
  }
}

export const setResponseCache = async (id: string, data: any, exprTimestamp: number = Date.now()) => {
  const result = await chrome.storage.local.get('requestCache')
  if (Object.keys(result?.requestCache || {}).length > 100) {
    // clear cache
    await chrome.storage.local.set({ requestCache: {} })
    const requestCache = {
      [id]: {
        data,
        exprTimestamp
      }
    }
    return chrome.storage.local.set({ requestCache })
  }
  const { requestCache = {} } = result
  requestCache[id] = {
    data,
    exprTimestamp
  }
  return chrome.storage.local.set({ requestCache })
}

export const getResponseCache = async <T = null>(id: string): Promise<T> => {
  const result = await chrome.storage.local.get('requestCache')
  const { requestCache = {} } = result
  const cache = requestCache[id]
  const now = Date.now()
  return cache?.exprTimestamp > now ? cache.data : null
}