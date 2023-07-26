import { EStorageKey, IBase64ListItem, INote, IReadItLaterItem, IWeekImage } from "~types"

import { generateId } from "./browser"
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
    // create new record
    const result = {
      base64,
      url,
      timestamp: Date.now()
    }
    // get old data
    const { base64List = [] } = await chrome.storage.local.get('base64List')

    // remove all expired data
    const newBase64List = base64List.filter((item: IBase64ListItem) => {
      return item.timestamp + 6 * 24 * 60 * 60 * 1000 > Date.now()
    })

    // add new data
    newBase64List.push(result)
    await chrome.storage.local.set({ base64List: newBase64List })
    console.log(result)
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

// save tab's parent and children relationship
export const saveTabsTree = async (tab: chrome.tabs.Tab) => {
  const { openerTabId, id } = tab
  const result = await chrome.storage.local.get(EStorageKey.tabsTree)
  const { tabsTree = {} } = result
  tabsTree[openerTabId] = {
    children: tabsTree[openerTabId]?.children || [],
  }
  if (!tabsTree[openerTabId].children.includes(id)) {
    tabsTree[openerTabId].children.push(id)
  }
}

// 因为依赖了随机的 activatedTabs，所以每次更新都要重新生成，触发 storage change 事件
// write random value and save to storage to trigger storage change event, update nav tree data update
export const triggerNavTreeUpdate = () => {
  const random = Math.random()
  chrome.storage.local.set({ [EStorageKey.activatedTabs]: random })
}

// get note list from storage
export const getNoteListFromStorage = async () => {
  const result = await chrome.storage.local.get(EStorageKey.noteList)
  const { noteList = [] } = result
  return noteList as INote[]
}

export const addNote = () => {
  const note = {
    id: generateId(),
    title: "bala bala...",
    content: "...",
    color: "#333",
    bgColor: "#fff"
  }
  saveNote(note)
}

// save note list into storage
export const saveNote = async (note: INote) => {
  const noteList = await getNoteListFromStorage()
  let oldIdx = noteList.length;
  const isExist = noteList.some((_note, idx) => {
    if (note.id === _note.id) {
      oldIdx = idx
      return true
    }
    return false
  })
  noteList[oldIdx] = note
  chrome.storage.local.set({
    [EStorageKey.noteList]: noteList
  })
}

export const removeNoteById = async (id: string) => {
  let noteList = await getNoteListFromStorage()
  noteList = noteList.filter((i) => i.id !== id)
  chrome.storage.local.set({
    [EStorageKey.noteList]: noteList
  })
}

// get sync bookmarks
export const getSyncBookmarks = async () => {
  const result = await chrome.storage.sync.get(EStorageKey.bookmarks)
  const { bookmarks = [] } = result
  return bookmarks as chrome.bookmarks.BookmarkTreeNode[]
}

// remove sync bookmarks
export const removeSyncBookmarks = async (id: string) => {
  console.log('remove id:', id)
  const bookmarks = await getSyncBookmarks()
  const newBookmarks = bookmarks.filter((i) => i.id !== id)
  chrome.storage.sync.set({
    [EStorageKey.bookmarks]: newBookmarks
  })
}

// add sync bookmarks
export const addSyncBookmarks = async (bookmark: { url: string, id: string, title: string }) => {
  const bookmarks = await getSyncBookmarks()
  bookmarks.push(bookmark as any)
  chrome.storage.sync.set({
    [EStorageKey.bookmarks]: bookmarks
  })
}

// get read it later list
export const getReadItLaterList = async () => {
  const result = await chrome.storage.local.get(EStorageKey.readItLaterList)
  const { readItLaterList = [] } = result
  return readItLaterList as IReadItLaterItem[]
}

// remove read it later list
export const removeReadItLaterList = async (id: string) => {
  const readItLaterList = await getReadItLaterList()
  const newReadItLaterList = readItLaterList.filter((i) => i.id.toString() !== id.toString())
  chrome.storage.local.set({
    [EStorageKey.readItLaterList]: newReadItLaterList
  })
}

// add read it later list
export const addReadItLaterList = async (bookmark: IReadItLaterItem) => {
  const readItLaterList = await getReadItLaterList()
  // check is exist
  const isExist = readItLaterList.some((i) => i.id.toString() === bookmark.id.toString())
  if (isExist) {
    // update
    const newReadItLaterList = readItLaterList.map((i) => {
      if (i.id.toString() === bookmark.id.toString()) {
        return bookmark
      }
      return i
    })
    return chrome.storage.local.set({
      [EStorageKey.readItLaterList]: newReadItLaterList
    })
  }
  readItLaterList.push(bookmark)
  chrome.storage.local.set({
    [EStorageKey.readItLaterList]: readItLaterList
  })
}