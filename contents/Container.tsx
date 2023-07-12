import styleText from "data-text:../style.css"
import hotkeys from "hotkeys-js"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import TreeNavigation from "~components/TreeNavigation"
import { ENavTreeMode } from "~types"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const CustomButton = () => {
  const [showNavbar, setShowNavbar] = useState(false)
  useEffect(() => {
    hotkeys("f1", () => {
      setShowNavbar(true)
    })

    return () => {
      hotkeys.unbind("f1")
    }
  }, [])
  if (showNavbar) {
    return (
      <div
        className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999999] bg-[#eeeeee30]"
        onClick={() => setShowNavbar(false)}>
        <TreeNavigation
          onClose={() => {
            setShowNavbar(false)
          }}
          mode={ENavTreeMode.content}
        />
      </div>
    )
  }
  return <div></div>
}

export default CustomButton
