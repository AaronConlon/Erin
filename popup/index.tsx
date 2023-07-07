import "../style.css"

import TreeNavigation from "~components/TreeNavigation"
import { ENavTreeMode } from "~types"

const Popup = () => {
  return (
    <div className="w-[520px] h-[600px] bg-gray-50 -mr-2">
      <TreeNavigation mode={ENavTreeMode.popup} />
    </div>
  )
}

export default Popup
