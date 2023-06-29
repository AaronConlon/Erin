import styleText from "data-text:../style.css"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"
import { VscListTree } from "react-icons/vsc"

import TreeNavigation from "~components/TreeNavigation"
import { ENavTreeMode } from "~types"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const CustomButton = () => {
  const [showNavbar, setShowNavbar] = useState(false)
  useEffect(() => {}, [])
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
  return (
    <div
      className="fixed bottom-[48px] -left-3 w-[32px] h-[32px] rounded-r-full bg-white border transition-all border-gray-300 flex justify-center items-center opacity-20 hover:opacity-100 cursor-pointer hover:left-0 z-[9999999]"
      onClick={() => {
        setShowNavbar(true)
      }}>
      <VscListTree />
    </div>
  )
}

export default CustomButton
