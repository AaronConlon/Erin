import { sendToBackground } from "@plasmohq/messaging"

import { EBgMessageName } from "~types"
import { triggerNavTreeUpdate } from "~utils/storage"
import { onDownloadImgByUrlAndFormat } from "~utils/wallpaper"

export {}

// handle message from background
chrome.runtime.onMessage.addListener(({ name, body }) => {
  if (name === EBgMessageName.copyMdContentToClipboard) {
    const { text } = body
    console.log("copyMdContentToClipboard", text)
    navigator.clipboard.writeText(text)
  } else if (name === EBgMessageName.downloadImgWithFormat) {
    // handle download img with difference format
    const { url, format } = body
    onDownloadImgByUrlAndFormat(url, format)
  } else if (name === EBgMessageName.applyPicInPicMode) {
    const videos = document.querySelectorAll("video")
    ;[...videos].some((v) => {
      if (v.paused === false) {
        // first playing video
        v.requestPictureInPicture()
      }
    })
  }
})

triggerNavTreeUpdate()
sendToBackground({
  name: "updateOpenerId",
  body: {
    referrer: document.referrer
  }
})
