import { EStorageKey } from "~types"
import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler<Record<string, any>> = async (req, res) => {
  try {
    const [tabs, result] = await Promise.all([chrome.tabs.query({ status: "complete" }), chrome.storage.local.get(EStorageKey.tabsTree)])
    // save tabs
    res.send({
      tabs,
      relationships: result[EStorageKey.tabsTree]
    })
  } catch (error) {
    console.log('background get tabs error', error)
  }
}

export default handler