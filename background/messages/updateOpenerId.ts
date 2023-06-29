import { EStorageKey } from "~types"
import type { PlasmoMessaging } from "@plasmohq/messaging"

// page loaded and update relationship config
const handler: PlasmoMessaging.MessageHandler<{ referrer: string }> = async (req, res) => {
  try {
    const { referrer } = req.body
    if (referrer !== '') {
      const tabs = await chrome.tabs.query({ url: referrer })
      const tab = tabs?.[0]
      if (tab) {
        const openerTabId = tab.id
        const tabId = req.sender.tab.id
        const result = await chrome.storage.local.get(EStorageKey.tabsTree)
        const { tabsTree = {} } = result
        // key is openerTabId, value is children tab id
        tabsTree[openerTabId] = tabsTree[openerTabId] || []
        if (!tabsTree[openerTabId].includes(tabId)) {
          tabsTree[openerTabId].push(tabId)
        }
        // save to storage
        chrome.storage.local.set({ tabsTree })
      }
    }
  } catch (error) {
    console.log('background get tabs error', error)
  } finally {
    res.send({})
  }
}

export default handler