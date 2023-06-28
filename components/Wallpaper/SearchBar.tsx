import { useAtom } from "jotai"
import { ChangeEvent, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"

import useBingSearchSuggestion from "~hooks/useBingSearchSuggestion"
import { settingConfigStore } from "~store"
import { onOpenQueryAtNewTab } from "~utils/browser"

import SearchEngineSwitch from "./SearchEngineSwitch"

export default function () {
  const [value, setValue] = useState("")
  const [setting] = useAtom(settingConfigStore)
  const { query, suggestions } = useBingSearchSuggestion()
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const _value = e.target.value.trim()
    query(_value)
    setValue(_value)
  }

  const onSearch = () => {
    // open search page
    if (value.length === 0) return
    const searchEngine = setting.searchEngine
    onOpenQueryAtNewTab(value, searchEngine)
  }

  return (
    <div className="rounded-md bg-gray-50 fixed top-[20vh] left-[50%] w-[600px] -translate-x-[50%] transform flex items-center p-2 py-2 gap-2">
      <SearchEngineSwitch />
      <input
        type="text"
        autoFocus
        className="flex-grow p-1.5 focus-visible:outline-none bg-white leading-6"
        value={value}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onSearch()
          }
        }}
        onChange={onChange}
      />
      <AiOutlineSearch
        className="absolute top-2.5 right-2 text-[32px] p-1 cursor-pointer text-primary"
        onClick={(e) => {
          e.stopPropagation()
          onSearch()
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute right-0 top-[105%] bg-white p-4 left-0 text-left min-h-[37px] rounded-md leading-6 cursor-pointer">
          {suggestions.slice(0, 9).map((s, idx) => (
            <div
              key={s}
              className="flex gap-2 flex-wrap text-gray-500 hover:bg-gray-50 hover:text-primary">
              <span
                style={{ color: `rgba(124,58,237,0.${9 - idx})` }}
                className="w-4 text-left text-[12px]">
                {idx + 1}
              </span>
              <span
                className="transition-all truncate hover:scale-[1.02] transform origin-center text-[14px] flex-grow"
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
