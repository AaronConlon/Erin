import { ENavTreeMode } from "~types"
import FullscreenFilterContainer from "~components/FullscreenFilterContainer"
import React from "react"
import TreeWindow from "./TreeWindow"
import clsx from "clsx"
import { settingConfigStore } from "~store"
import { useAtom } from "jotai"
import { useState } from "react"

export default function ({
  mode = ENavTreeMode.newtab,
  onClose
}: {
  mode?: ENavTreeMode
  onClose?: () => void
}) {
  const [, setSetting] = useAtom(settingConfigStore)

  const [offset, setOffset] = useState(0)

  const onHiddenNav = () => {
    setSetting((prev) => ({
      ...prev,
      showBrowserTreeNav: false
    }))
  }

  return (
    <FullscreenFilterContainer
      onClickOutside={onHiddenNav}
      classnames={clsx("text-[14px]", {
        "bg-[#33333360] justify-center items-center flex":
          mode !== ENavTreeMode.popup
      })}>
      <div
        className={clsx(
          "overflow-y-auto py-4 rounded-md min-h-[30vh] max-h-[75vh]  min-w-[500px] max-w-[800px] justify-start text-left transition-all transform border-gray-50 border-opacity-20 hover:border-opacity-80 border",
          {
            "-translate-x-[100vw]": offset !== 0,
            "backdrop-blur-md text-white": mode === ENavTreeMode.newtab,
            "bg-white text-gray-700": mode === ENavTreeMode.content,
            "max-h-[90vh] ml-4": mode !== ENavTreeMode.popup,
            "ml-2.5 max-h-[580px] pr-0 mr-0": mode === ENavTreeMode.popup
          }
        )}>
        {mode !== ENavTreeMode.popup && (
          <div className="flex items-center gap-2 mb-2 ml-4">
            <span
              className="bg-red-400 rounded-full w-[12px] h-[12px] flex justify-center items-center text-[12px] cursor-pointer group"
              onClick={() => {
                setOffset(1)
                setTimeout(() => {
                  // console.log("update show browser tree nav")
                  setSetting((v) => ({ ...v, showBrowserTreeNav: false }))
                  onClose?.()
                }, 400)
              }}>
              <span className="transform scale-75 group-hover:opacity-100 text-[14px] opacity-0">
                x
              </span>
            </span>
            <span className="bg-yellow-400 rounded-full w-[12px] h-[12px]"></span>
            <span className="bg-green-400 rounded-full w-[12px] h-[12px]"></span>
          </div>
        )}
        <TreeWindow mode={mode} />
      </div>
    </FullscreenFilterContainer>
  )
}
