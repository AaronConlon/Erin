import * as Collapsible from "@radix-ui/react-collapsible"
import { Cross2Icon, RowSpacingIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import logo from "data-base64:~assets/icon.png"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import React from "react"

import { sendToBackground } from "@plasmohq/messaging"

import FullscreenFilterContainer from "~components/FullscreenFilterContainer"
import { settingConfigStore } from "~store"
import { EStorageKey } from "~types"
import { openTab } from "~utils/browser"
import { maybeBackupString } from "~utils/format"

export default function () {
  const [, setSetting] = useAtom(settingConfigStore)
  const [tabs, setTabs] = useState([] as chrome.tabs.Tab[])
  const [tabRelationships, setTabRelationships] = useState(
    {} as Record<number, number[]>
  )
  const [windows, setWindows] = useState([] as number[])
  const [offset, setOffset] = useState(0)
  const [open, setOpen] = useState({} as Record<number, boolean>)
  const timer = useRef<NodeJS.Timer>(null)
  // const onHiddenNav = () => {
  //   setSetting((prev) => ({
  //     ...prev,
  //     showBookmarkBar: false,
  //     showSearchBar: false,
  //     showBrowserTreeNav: false
  //   }))
  // }

  useEffect(() => {
    const init = async () => {
      try {
        const { tabs, relationships } = (await sendToBackground({
          name: "tabs"
        })) as {
          tabs: chrome.tabs.Tab[]
          relationships: Record<number, number[]>
        }
        setTabs(tabs)
        setTabRelationships(relationships)
        console.log("relationships: ", relationships)
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
    chrome.storage.onChanged.addListener((changes, namespace) => {
      console.log(changes, namespace)
      if (
        namespace === "local" &&
        (changes[EStorageKey.tabsTree] || changes[EStorageKey.activatedTabs])
      ) {
        init()
      }
    })
    timer.current = setInterval(init, 3000)
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <FullscreenFilterContainer classnames="justify-start">
      <div
        className={clsx(
          "max-h-[90vh] overflow-y-auto py-4 rounded-md min-h-[30vh] min-w-[400px] max-w-[600px] justify-start ml-4 backdrop-blur-md text-white text-left transition-all transform border-gray-50 border-opacity-20 hover:border-opacity-80 border",
          { "-translate-x-[150%]": offset !== 0 }
        )}>
        <div className="flex items-center gap-2 mb-2 ml-4">
          <span
            className="bg-red-400 rounded-full w-3 h-3 flex justify-center items-center text-[12px] cursor-pointer group"
            onClick={() => {
              setOffset(1)
              setTimeout(() => {
                setSetting((v) => ({ ...v, showBrowserTreeNav: false }))
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
                  setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
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
                      {open[id] ? <Cross2Icon /> : <RowSpacingIcon />}
                    </button>
                  </Collapsible.Trigger>
                </div>
                <div className="h-[1px] w-full bg-gray-50 bg-opacity-10 my-2"></div>
                <Collapsible.Content>
                  {tabs
                    .filter((i) => i.windowId === id && !i.openerTabId)
                    .map((tab) => (
                      <NavItem key={tab.id} tab={tab}>
                        {tabs
                          .filter((i) => i.openerTabId === tab.id)
                          .map((i) => (
                            <NavItem key={i.id} tab={i} />
                          ))}
                      </NavItem>
                    ))}
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          )
        })}
      </div>
    </FullscreenFilterContainer>
  )
}

const NavItem: React.FC<{ tab: chrome.tabs.Tab; children?: any }> = ({
  tab,
  children
}) => {
  return (
    <div>
      <div
        key={tab.id}
        className="flex flex-nowrap items-center gap-2 group cursor-pointer mb-2 hover:bg-[#eeeeee20]">
        <img
          src={maybeBackupString({
            str: tab.favIconUrl,
            backup: logo
          })}
          className="w-6 h-6 rounded-sm p-1"
        />
        <span
          className="cursor-pointer truncate mr-auto]"
          onClick={() => openTab(tab)}>
          {tab.title}
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-all ml-auto mr-1">
          <Cross2Icon />
        </span>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  )
}
