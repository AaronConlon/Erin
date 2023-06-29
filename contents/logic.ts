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