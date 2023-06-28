import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import classnames from "clsx"
import { useAtom } from "jotai"
import React from "react"

import { settingConfigStore } from "~store"
import { ESearchEngine } from "~types"

const SearchEngineSwitch = () => {
  const [setting, setSetting] = useAtom(settingConfigStore)
  return (
    <Select.Root
      value={setting.searchEngine}
      onValueChange={(v) =>
        setSetting((prev) => ({ ...prev, searchEngine: v as ESearchEngine }))
      }>
      <Select.Trigger className="flex justify-between items-center capitalize p-1 px-2 outline-none min-w-[60px] border-l-4 border-l-[var(--primary)] text-primary">
        <Select.Value />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-sm">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            <Select.Group>
              {Object.keys(ESearchEngine).map((k) => {
                return (
                  <SelectItem value={k} key={k}>
                    {k}
                  </SelectItem>
                )
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef(
  ({ children, className, onClick, ...props }: any, forwardedRef) => {
    return (
      <Select.Item
        onClick={onClick}
        className={classnames(
          "capitalize m-1 p-1 pr-6 hover:bg-[var(--primary)] hover:text-white outline-none",
          className
        )}
        {...props}
        ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        {/* <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator> */}
      </Select.Item>
    )
  }
)

export default SearchEngineSwitch
