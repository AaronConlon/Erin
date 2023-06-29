import { EStorageKey } from "~types";
import { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.Handler<{ host: string, base64: string }> = async (req, res) => {
  const { host, base64 } = req.body
  const result = await chrome.storage.local.get(EStorageKey.iconCache)
  const iconCache = result[EStorageKey.iconCache] || {}
  iconCache[host] = {
    base64,
    expr: Date.now() + 1000 * 60 * 60 * 24 * 30
  }

  chrome.storage.local.set({
    [EStorageKey.iconCache]: iconCache
  })
  res.send({})
}


export default handler