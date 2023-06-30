import { EStorageKey } from "~types";
import { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.Handler<{ host: string }> = async (req, res) => {
  const { host } = req.body
  const result = await chrome.storage.local.get(EStorageKey.iconCache)
  const iconCache = result[EStorageKey.iconCache] || {}
  const { base64, expr } = iconCache[host] ?? {}
  if (expr && base64 && expr > Date.now()) {
    res.send({ base64 })
  } else {
    res.send({})
  }
}


export default handler