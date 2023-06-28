import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler<Record<string, any>> = async (req, res) => {
  try {
    console.log('tabs message...')
    const tabs = await chrome.tabs.query({})
    console.log('raw tabs', tabs)
    res.send({
      tabs
    })
  } catch (error) {
    console.log('background get tabs error', error)
  }
}

export default handler