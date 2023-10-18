import { settingConfigStore } from "~store";
import { EAdultFeatureUrl } from "~types";
import { onStopPaClickPropagation } from "~utils/browser";
import clsx from "clsx";
import hotkeys from "hotkeys-js";
import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

export default function () {
  const [setting, setSetting] = useAtom(settingConfigStore)
  const [showSearch, setShowSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
  const onceRef = useRef(false)

  const getSearchPrefixText = () => {
    if (setting.showJable) return "JableTV"
    if (setting.showMissAV) return "MissAV"
    if (setting.showAcg) return "Acg 动漫"
    if (setting.showNaiflix) return "奈飞仿站影视"
    return "..."
  }

  const getPlaceholderText = () => {
    if (setting.showJable) return "JUFE-200？"
    if (setting.showMissAV) return "DLDSS-199?"
    if (setting.showAcg) return "通灵王?"
    if (setting.showNaiflix) return "变形金刚?"
    return "Search keyword and ......"
  }

  const getTargetUrl = (_value: string) => {
    let value = _value
    if (_value === "") {
      value = getPlaceholderText()
        ?.replace("?", "")
        ?.replace("Search keyword and ......", "")
    }
    if (setting.showJable)
      return EAdultFeatureUrl.jableTV.replace("__KEYWORD__", value)
    if (setting.showMissAV)
      return EAdultFeatureUrl.missAV.replace("__KEYWORD__", value)
    if (setting.showAcg)
      return EAdultFeatureUrl.Acg.replace("__KEYWORD__", value)
    if (setting.showNaiflix)
      return EAdultFeatureUrl.Naiflix.replace("__KEYWORD__", value)
    return "https://www.google.com/search?q=" + value
  }

  const onClickEnter = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value?.trim()
      e.target.value = ""
      setShowSearch(false)
      window.open(getTargetUrl(value), "_blank")
    } else if (e.key === "Escape") {
      setShowSearch(false)
      setSetting((v) => ({
        ...v,
        showMissAV: false,
        showJable: false,
        showAcg: false,
        showNaiflix: false
      }))
    }
  }

  useEffect(() => {
    console.log("xxxx")
    const onHiddenFeature = () => {
      setShowSearch(false)
      setSetting((v) => ({ ...v, showMissAV: false, showJable: false }))
    }
    if (onceRef.current === false) {
      onceRef.current = true
      hotkeys("j,m,a,n", (e, handler) => {
        setShowSearch(true)
        // 获取站点类型
        setSetting((v) => ({
          ...v,
          showMissAV: handler.key === "m",
          showJable: handler.key === "j",
          showAcg: handler.key === "a",
          showNaiflix: handler.key === "n"
        }))
        setTimeout(() => {
          inputRef.current?.focus()
        }, 300)
      })

      window.addEventListener("click", onHiddenFeature)
    }

    return () => {
      hotkeys.unbind("j,m,a,n")
      window.removeEventListener("click", onHiddenFeature)
    }
  }, [setting.enableHiddenFeature])

  if (setting.enableHiddenFeature === false || showSearch === false) {
    return null
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[999999] bg-[#1d1f2180] flex justify-center items-center"
      onClick={() => {
        setSetting((v) => ({
          ...v,
          showMissAV: false,
          showJable: false,
          showAcg: false,
          showNaiflix: false
        }))
        setShowSearch(false)
      }}
      onContextMenu={onStopPaClickPropagation}>
      <div
        className={clsx(
          "relative p-2 rounded-md bg-white transition-all ease-in-out flex justify-between items-center",
          {
            "top-0 opacity-1": showSearch,
            "top-4 opacity-0": !showSearch
          }
        )}
        onClick={onStopPaClickPropagation}
        style={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
        }}>
        <span
          className={clsx(
            "text-white rounded-full leading-6 px-4 py-1 cursor-pointer",
            {
              "bg-pink-500": setting.showJable || setting.showMissAV,
              "bg-blue-600": setting.showAcg,
              "bg-red-500": setting.showNaiflix
            }
          )}
          onClick={() => {
            setShowSearch(false)
          }}>
          {getSearchPrefixText()}
        </span>
        <input
          ref={inputRef}
          className="outline-none border-none px-4 py-2 w-[30vw] max-w-[300px] pl-4 text-[18px]"
          placeholder={getPlaceholderText()}
          onKeyUp={onClickEnter}
        />
      </div>
    </div>
  )
}