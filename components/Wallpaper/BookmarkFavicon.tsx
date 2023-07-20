import clsx from "clsx"
import { useState } from "react"

export default function ({ url, size = 28 }: { url: string; size?: number }) {
  const [isLoaded, setIsLoaded] = useState(false)

  function faviconURL(u: string) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"))
    url.searchParams.set("pageUrl", u)
    url.searchParams.set("size", size.toString())
    return url.toString()
  }

  return (
    <div className="inline-block rounded-md bg-white">
      <img
        onLoad={() => setIsLoaded(true)}
        src={faviconURL(url)}
        className={clsx("w-[24px] h-[24px]", {
          "opacity-0": !isLoaded
        })}
        alt="ico"
      />
    </div>
  )
}
