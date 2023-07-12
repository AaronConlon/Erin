import "../style.css"

import TreeWindow from "~components/TreeNavigation/TreeWindow"
import { ENavTreeMode } from "~types"

const Popup = () => {
  return (
    <div className="w-[520px] h-[600px] bg-gray-50 p-2">
      <TreeWindow mode={ENavTreeMode.popup} />
    </div>
  )
}

export default Popup
