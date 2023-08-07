import { useAtom } from "jotai"
import { useState } from "react"

import { showAsideSettingStore } from "~store"

import FullscreenFilterContainer from "./FullscreenFilterContainer"

export default function () {
  const [right, setRight] = useState(0)
  const [showAsideSetting, setShowAsideSetting] = useAtom(showAsideSettingStore)
  if (!showAsideSetting) return null

  return (
    <FullscreenFilterContainer
      onClickOutside={() => setShowAsideSetting(false)}>
      <div
        className="absolute top-0 bottom-0 w-[400px] h-screen overflow-y-auto border-l border-gray-400 bg-white"
        style={{
          right: `${right}px`
        }}>
        <div>settings...</div>
      </div>
    </FullscreenFilterContainer>
  )
}
