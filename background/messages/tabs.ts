import { EStorageKey } from "~types"
import type { PlasmoMessaging } from "@plasmohq/messaging"
import { uniq } from "lodash-es"

const handler: PlasmoMessaging.MessageHandler<Record<string, any>> = async (req, res) => {
  try {
    const [tabs, result] = await Promise.all([chrome.tabs.query({}), chrome.storage.local.get(EStorageKey.tabsTree)])
    // const tabs = await chrome.tabs.query({ status: "complete" })
    const tabIdList = tabs.map(i => i.id)
    const relationships = (result[EStorageKey.tabsTree] ?? {}) as Record<string, number[]>
    const keys = Object.keys(relationships)
    for (const k of keys) {
      if (!tabIdList.includes(+k)) {
        relationships[k] = undefined
        keys.forEach(_key => {
          const list = relationships[_key]
          if (Array.isArray(list)) {
            relationships[_key] = relationships[_key].filter(i => i !== +k)
          }
        })
      }
    }
    // init all relation key
    tabs.forEach(tab => {
      if (relationships[tab.id] === undefined) {
        relationships[tab.id] = []
      }
      const { openerTabId } = tab
      if (openerTabId !== undefined) {
        relationships[openerTabId] = uniq([...relationships[openerTabId], tab.id])
      }
    })
    // save data
    await chrome.storage.local.set({
      [EStorageKey.tabsTree]: relationships
    })
    // save tabs
    res.send({
      tabs,
      relationships
    })
  } catch (error) {
    console.log('background get tabs error', error)
  }
}

export default handler