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
  } else if (name === EBgMessageName.viewImgInContent) {
    const { srcUrl } = body
    console.log("view image...", srcUrl)
    const img = new Image()
    img.style.maxWidth = "90%"
    img.style.maxHeight = "90%"
    img.src = srcUrl
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.top = "0"
    container.style.left = "0"
    container.style.width = "100%"
    container.style.height = "100%"
    container.style.zIndex = "99999999"
    container.style.backgroundColor = "rgba(0,0,0,.5)"
    container.style.display = "flex"
    container.style.justifyContent = "center"
    container.style.alignItems = "center"
    container.style.cursor = "pointer"
    container.onclick = () => {
      container.remove()
    }
    const closeIcon = document.createElement("span")
    closeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="cursor: pointer  width="32" height="32" viewBox="0 0 24 24"><path fill="white" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>`
    closeIcon.style.position = "fixed"
    closeIcon.style.top = "10px"
    closeIcon.style.right = "10px"
    closeIcon.style.backgroundColor = "#171917"
    closeIcon.style.cursor = "pointer"
    closeIcon.onclick = () => {
      container.remove()
    }
    container.appendChild(closeIcon)
    container.appendChild(img)
    document.body.appendChild(container)
  }
})

triggerNavTreeUpdate()
sendToBackground({
  name: "updateOpenerId",
  body: {
    referrer: document.referrer
  }
})
