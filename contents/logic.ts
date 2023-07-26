import { EBgMessageName } from "~types"
import { sendToBackground } from "@plasmohq/messaging"
import { triggerNavTreeUpdate } from "~utils/storage"
export { }
document.addEventListener('DOMContentLoaded', () => {
  triggerNavTreeUpdate()
  sendToBackground({
    name: 'updateOpenerId',
    body: {
      referrer: document.referrer
    }
  })
})

// handle message from background
chrome.runtime.onMessage.addListener((message) => {
  console.log('message from background', message)
  if(message.name === EBgMessageName.copyMdTitleText) {
    const { text } = message.body
    navigator.clipboard.writeText(text)
  }
})