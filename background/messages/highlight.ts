import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler<{ windowId: number, id: number, index: number }> = async (req, res) => {
  const { windowId, id, index } = req.body
  await chrome.tabs.highlight({ tabs: [index], windowId })
  await chrome.tabs.update(id, { active: true })
  res.send({})
}

export default handler