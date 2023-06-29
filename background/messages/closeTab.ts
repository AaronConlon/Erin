import { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.Handler<{ tab: chrome.tabs.Tab }> = async (req, res) => {
  const { tab } = req.body
  await chrome.tabs.remove(tab.id)
  res.send({})
}

export default handler