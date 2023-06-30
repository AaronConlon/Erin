import logo from "data-base64:~assets/icon.png"
import { CSSProperties, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { getImageHost } from "~utils/browser"
import { onGetUrlBase64InBrowser } from "~utils/browser"

export default function ({
  src,
  styles,
  classnames
}: {
  src: string
  styles?: CSSProperties
  classnames?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [base64Url, setBase64Url] = useState("" as string)

  useEffect(() => {
    const init = async () => {
      try {
        const host = getImageHost(src, logo)
        const result = await sendToBackground({
          name: "getIcon",
          body: {
            host
          }
        })
        if (result.base64) {
          setBase64Url(result.base64 as string)
        } else {
          const res = await onGetUrlBase64InBrowser(src)
          sendToBackground({
            name: "saveIcon",
            body: {
              host,
              base64: res
            }
          })
          setBase64Url(res)
        }
        setLoaded(true)
      } catch (error) {
        console.log("fetch icon failed...", error)
      }
    }
    init()
  }, [src])
  return (
    <img
      src={loaded ? base64Url : logo}
      style={styles}
      className={classnames}
    />
  )
}
