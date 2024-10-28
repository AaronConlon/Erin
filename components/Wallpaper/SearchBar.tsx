import { ChangeEvent, useState } from "react"
import { asideSettingConfigStore, settingConfigStore } from "~store"
import { onOpenQueryAtNewTab, onStopPaClickPropagation } from "~utils/browser"

import { useAtom } from "jotai"
import { AiOutlineSearch } from "react-icons/ai"
import useBingSearchSuggestion from "~hooks/useBingSearchSuggestion"
import { EZIndexRecord } from "~types"
import SearchEngineSwitch from "./SearchEngineSwitch"

export default function () {
  const [value, setValue] = useState("")
  const [setting] = useAtom(settingConfigStore)
  const [asideConfig] = useAtom(asideSettingConfigStore)
  const { query, suggestions } = useBingSearchSuggestion()
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const _value = e.target.value
    query(_value)
    setValue(_value)
  }

  const onSearch = () => {
    // open search page
    if (value.length === 0) return
    const searchEngine = setting.searchEngine
    onOpenQueryAtNewTab(value.trim(), searchEngine)
  }
  
  return (
    <div
      style={{
        zIndex: EZIndexRecord.searchBar,
        scale: `${asideConfig.searchBar.iconSize / 24}`
      }}
      onClick={onStopPaClickPropagation}
      className="mx-auto left-0 right-0 rounded-md origin-center bg-gray-50 fixed top-[10vh]  w-[500px] transform flex items-center p-2 py-2 gap-2">
      <SearchEngineSwitch />
      <input
        type="text"
        autoFocus
        className="flex-grow p-[8px] pl-0 pr-[32px] focus-visible:outline-none bg-gray-50 bg-opacity-20 leading-[24px] text-[16px] rounded-lg"
        value={value}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onSearch()
          }
        }}
        onChange={onChange}
      />
      <AiOutlineSearch
        className="absolute top-[50%] translate-y-[-50%] right-2 text-[32px] p-1 cursor-pointer text-primary"
        onClick={(e) => {
          e.stopPropagation()
          onSearch()
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute right-0 top-[105%] bg-white bg-opacity-100 p-4 left-0 text-left min-h-[37px] rounded-md leading-6 cursor-pointer flex flex-col gap-2">
          {suggestions.slice(0, 9).map((s, idx) => (
            <div
              key={s}
              className="flex flex-wrap items-center gap-2 pl-2 text-gray-500 rounded-md hover:bg-gray-50 hover:bg-opacity-50 hover:text-primary">
              <span
                style={{ color: `rgba(124,58,237,0.${9 - idx})` }}
                className="w-4 text-left text-[12px]">
                {idx + 1}
              </span>
              <span
                className="transition-all truncate hover:scale-[1.02] transform origin-center text-[14px] hover:leading-[32px] hover:text-[16px] flex-grow"
                onClick={() => onOpenQueryAtNewTab(s, setting.searchEngine)}>
                {s}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
