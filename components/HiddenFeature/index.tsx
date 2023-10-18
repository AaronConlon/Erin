import { useEffect, useMemo, useRef, useState } from "react"

import { EAdultFeatureUrl } from "~types"
import clsx from "clsx"
import hotkeys from "hotkeys-js"
import { onStopPaClickPropagation } from "~utils/browser"
import { settingConfigStore } from "~store"
import { useAtom } from "jotai"

export default function () {
  const [setting, setSetting] = useAtom(settingConfigStore)
  const [showSearch, setShowSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
  const onceRef = useRef(false)

  const getSearchPrefixText = () => {
    if (setting.showJable) return "JableTV"
    if (setting.showMissAV) return "MissAV"
    return "..."
  }

  const getTargetUrl = (value: string) => {
    if (setting.showJable)
      return EAdultFeatureUrl.jableTV.replace("__KEYWORD__", value)
    if (setting.showMissAV)
      return EAdultFeatureUrl.missAV.replace("__KEYWORD__", value)
    return ""
  }

  const onClickEnter = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value?.trim()
      e.target.value = ""
      setShowSearch(false)
      window.open(getTargetUrl(value), "_blank")
    }
  }

  useEffect(() => {
    const onHiddenFeature = () => {
      setShowSearch(false)
    }
    if (onceRef.current === false) {
      onceRef.current = true
      hotkeys("j, m", (e, handler) => {
        setShowSearch(true)
        // 获取站点类型
        setSetting((v) => ({
          ...v,
          showMissAV: handler.key === "m",
          showJable: handler.key !== "m"
        }))
        setTimeout(() => {
          inputRef.current?.focus()
        }, 300)
      })
      window.addEventListener("click", onHiddenFeature)
    }

    return () => {
      hotkeys.unbind("j")
      window.removeEventListener("click", onHiddenFeature)
    }
  }, [setting.enableHiddenFeature])

  if (setting.enableHiddenFeature === false || showSearch === false) {
    return null
  }

  return (
    <div
      className={clsx(
        "fixed z-[999999] bottom-4 p-2 rounded-md bg-white transition-all ease-in-out flex justify-between items-center",
        {
          "right-4 opacity-1": showSearch,
          "-right-4 opacity-0": !showSearch
        }
      )}
      onClick={onStopPaClickPropagation}
      style={{
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }}>
      <span
        className="bg-pink-500 text-white rounded-full h-6 leading-6 px-4 cursor-pointer"
        onClick={() => {
          setShowSearch(false)
        }}>
        {getSearchPrefixText()}
      </span>
      <input
        ref={inputRef}
        className="outline-none border-none px-4 py-2 w-48 pl-4"
        placeholder="Search keyword and ... FK"
        onKeyUp={onClickEnter}
      />
    </div>
  )
}
