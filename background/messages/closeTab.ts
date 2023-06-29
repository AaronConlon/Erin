import { EStorageKey } from "~types";
import { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.Handler<{ tab: chrome.tabs.Tab }> = async (req, res) => {
  const { tab } = req.body
  const result = await chrome.storage.local.get(EStorageKey.tabsTree)
  const tabsTree = result[EStorageKey.tabsTree] as Record<number, number[]>
  const subTabIds = tabsTree[tab.id]
  chrome.tabs.remove(tab.id)
  subTabIds.forEach(id => chrome.tabs.remove(id))
  res.send({})
}

export default handler