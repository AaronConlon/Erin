import { EBgMessageName } from "~types"
import { onDownloadImgByUrlAndFormat } from "~utils/wallpaper"
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
  console.log('message from background', message.body, message.name)
  if(message.name === EBgMessageName.copyMdContentToClipboard) {
    const { text } = message.body
    navigator.clipboard.writeText(text)
  } else if(message.name === EBgMessageName.downloadImgWithFormat) {
    // handle download img with difference format
    const {url, format} = message.body;
    onDownloadImgByUrlAndFormat(url, format)
  }
})

