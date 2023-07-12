import { Cross2Icon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { useMemo } from "react"

import Icon from "~components/Icon"
import { ENavTreeMode } from "~types"
import { closeTab, openTab } from "~utils/browser"
import { maybeBackupString } from "~utils/format"

export default function NavGroup({
  tabs,
  relationship,
  mode
}: {
  tabs: chrome.tabs.Tab[]
  mode: ENavTreeMode
  relationship: Record<string, number[]>
}) {
  return (
    <>
      {tabs
        .filter(
          (i) =>
            !Object.entries(relationship).some(([k, v]) => v.includes(i.id))
        )
        .map((tab) => {
          return (
            <NavItem
              tab={tab}
              tabs={tabs}
              key={tab.index}
              relationship={relationship}
              mode={mode}
            />
          )
        })}
    </>
  )
}

const NavItem: React.FC<{
  tab: chrome.tabs.Tab
  tabs: chrome.tabs.Tab[]
  mode: ENavTreeMode
  relationship: Record<string, number[]>
}> = ({ tab, relationship, tabs, mode }) => {
  const { subTab } = useMemo(() => {
    const subKeys = relationship[tab.id.toString()] ?? []
    const subTab = tabs.filter((i) => subKeys.includes(i.id))
    return {
      subTab
    }
  }, [tab, relationship])

  return (
    <div>
      <div
        key={tab.id}
        className={clsx(
          "flex flex-nowrap items-center gap-2 group cursor-pointer py-1",
          {
            "border-gray-50 hover:bg-[#eeeeee20]": mode === ENavTreeMode.newtab,
            "border-gray-500 hover:bg-[#eeeeee60]":
              mode === ENavTreeMode.content,
            "hover:bg-gray-100": mode === ENavTreeMode.popup
          }
        )}>
        <Icon
          src={tab.favIconUrl}
          classnames="w-[28px] h-[28px] rounded-sm p-1"
        />
        <span
          className="cursor-pointer truncate mr-auto text-[13px]"
          onClick={() => openTab(tab)}>
          {maybeBackupString({ str: tab.title, backup: "..." })}
        </span>
        <span
          className="opacity-0 group-hover:opacity-100 transition-all ml-auto mr-1 text-[12px]"
          onClick={() => closeTab(tab)}>
          <Cross2Icon />
        </span>
      </div>
      {subTab.length > 0 && (
        <div className="pl-6">
          {subTab.map((tab) => (
            <NavItem
              mode={mode}
              key={tab.id}
              tabs={tabs}
              tab={tab}
              relationship={relationship}
            />
          ))}
        </div>
      )}
    </div>
  )
}
