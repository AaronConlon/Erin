import * as Collapsible from "@radix-ui/react-collapsible"
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { AiOutlineMinusSquare } from "react-icons/ai"

import { sendToBackground } from "@plasmohq/messaging"

import FullscreenFilterContainer from "~components/FullscreenFilterContainer"
import Icon from "~components/Icon"
import { settingConfigStore } from "~store"
import { ENavTreeMode, EStorageKey } from "~types"
import { closeTab, openTab } from "~utils/browser"

export default function ({
  mode = ENavTreeMode.newtab,
  onClose
}: {
  mode?: ENavTreeMode
  onClose?: () => void
}) {
  const [, setSetting] = useAtom(settingConfigStore)
  const [tabs, setTabs] = useState([] as chrome.tabs.Tab[])
  const [tabRelationships, setTabRelationships] = useState(
    {} as Record<number, number[]>
  )
  const [windows, setWindows] = useState([] as number[])
  const [offset, setOffset] = useState(0)
  const [open, setOpen] = useState({} as Record<number, boolean>)
  const timer = useRef<NodeJS.Timer>(null)
  const onHiddenNav = () => {
    setSetting((prev) => ({
      ...prev,
      showBookmarkBar: false,
      showSearchBar: false,
      showBrowserTreeNav: false
    }))
  }

  useEffect(() => {
    const init = async () => {
      console.log("init tabs")
      try {
        const { tabs, relationships } = (await sendToBackground({
          name: "tabs"
        })) as {
          tabs: chrome.tabs.Tab[]
          relationships: Record<number, number[]>
        }
        console.log("\n")
        console.log("tabs: ", tabs)
        console.log("relationships: ", relationships)
        console.log("\n")

        setTabs(tabs)
        setTabRelationships(relationships)
        // console.log("relationships: ", relationships)
        const _windows = [] as number[]
        tabs.forEach((tab) => {
          const { windowId } = tab
          // add new window
          if (!_windows.some((i) => i === windowId)) {
            _windows.push(windowId)
          }
        })
        setWindows(_windows)
      } catch (error) {
        console.log("init tabs fail: ", error)
      }
    }
    init()
    if (mode === "newtab") {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        console.log(changes, namespace)
        if (
          namespace === "local" &&
          (changes[EStorageKey.tabsTree] || changes[EStorageKey.activatedTabs])
        ) {
          init()
        }
      })
    }
    // timer.current = setInterval(init, 1000)
    return () => {
      clearInterval(timer.current)
    }
  }, [mode])

  return (
    <FullscreenFilterContainer
      onClickOutside={onHiddenNav}
      classnames="justify-center items-center flex bg-[#33333360] text-[14px]">
      <div
        className={clsx(
          "max-h-[90vh] overflow-y-auto py-4 rounded-md min-h-[30vh] min-w-[500px] max-w-[800px] justify-start ml-4 backdrop-blur-md text-white text-left transition-all transform border-gray-50 border-opacity-20 hover:border-opacity-80 border",
          { "-translate-x-[100vw]": offset !== 0 }
        )}>
        <div className="flex items-center gap-2 mb-2 ml-4">
          <span
            className="bg-red-400 rounded-full w-3 h-3 flex justify-center items-center text-[12px] cursor-pointer group"
            onClick={() => {
              setOffset(1)
              setTimeout(() => {
                console.log("update show browser tree nav")
                setSetting((v) => ({ ...v, showBrowserTreeNav: false }))
                onClose?.()
              }, 400)
            }}>
            <span className="transform scale-75 group-hover:opacity-100 opacity-0">
              x
            </span>
          </span>
          <span className="bg-yellow-400 rounded-full w-3 h-3"></span>
          <span className="bg-green-400 rounded-full w-3 h-3"></span>
        </div>
        {windows.map((id, idx) => {
          return (
            <div key={id} className="p-2">
              <Collapsible.Root
                className="border border-gray-50 border-opacity-10 hover:border-opacity-50 rounded-sm p-2 transition-all"
                open={open[id] !== false}
                onOpenChange={() => {
                  setOpen((prev) => ({
                    ...prev,
                    [id]: prev[id] !== false ? false : true
                  }))
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                  <span>窗口 {idx + 1}</span>

                  <Collapsible.Trigger asChild>
                    <button className="IconButton">
                      {open[id] === false ? (
                        <RowSpacingIcon />
                      ) : (
                        <AiOutlineMinusSquare />
                      )}
                    </button>
                  </Collapsible.Trigger>
                </div>
                <div className="h-[1px] w-full bg-gray-50 bg-opacity-10 my-2"></div>
                <Collapsible.Content>
                  {/* {tabs
                    .filter((i) => i.windowId === id && !i.openerTabId)
                    .map((tab) => (
                      <NavItem key={tab.id} tab={tab}>
                        {tabs
                          .filter((i) => i.openerTabId === tab.id)
                          .map((i) => (
                            <NavItem key={i.id} tab={i} />
                          ))}
                      </NavItem>
                    ))} */}
                  <NavGroup
                    tabs={tabs.filter((i) => i.windowId === id)}
                    relationship={tabRelationships}
                  />
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          )
        })}
      </div>
    </FullscreenFilterContainer>
  )
}

function NavGroup({
  tabs,
  relationship
}: {
  tabs: chrome.tabs.Tab[]
  relationship: Record<string, number[]>
}) {
  const { rootItems, childrenRelationship } = useMemo(() => {
    const keys = Object.keys(relationship)
    const values = Object.values(relationship).flat()
    // find out the root tabs
    const rootKeys = keys.filter((key) => !values.includes(+key))
    const rootItems = tabs.filter((tab) => rootKeys.includes(tab.id.toString()))
    const childrenKeys = keys.filter((key) => values.includes(+key))
    // const childrenItems = tabs.filter((tab) => childrenKeys.includes(tab.id.toString()))
    const childrenRelationship = childrenKeys.reduce((prev, cur) => {
      const children = relationship[cur]
      const parent = tabs.find((tab) => tab.id.toString() === cur)
      if (parent) {
        prev[parent.id] = children
      }
      return prev
    }, {} as Record<string, number[]>)
    return {
      rootItems,
      childrenRelationship
    }
  }, [tabs, relationship])

  return (
    <>
      {rootItems.map((tab) => {
        return (
          <NavItem
            tab={tab}
            tabs={tabs}
            key={tab.index}
            relationship={relationship}
          />
        )
      })}
    </>
  )
}

const NavItem: React.FC<{
  tab: chrome.tabs.Tab
  tabs: chrome.tabs.Tab[]
  relationship: Record<string, number[]>
}> = ({ tab, relationship, tabs }) => {
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
        className="flex flex-nowrap items-center gap-2 group cursor-pointer mb-2 hover:bg-[#eeeeee20]">
        <Icon
          src={tab.favIconUrl}
          classnames="w-[28px] h-[28px] rounded-sm p-1"
        />
        <span
          className="cursor-pointer truncate mr-auto text-[13px]"
          onClick={() => openTab(tab)}>
          {tab.title}
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
