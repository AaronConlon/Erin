import * as Collapsible from "@radix-ui/react-collapsible"
import { RowSpacingIcon } from "@radix-ui/react-icons"
import clsx from "clsx"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { AiOutlineMinusSquare } from "react-icons/ai"

import { sendToBackground } from "@plasmohq/messaging"

import { ENavTreeMode, EStorageKey } from "~types"

import NavGroup from "./NavGroup"

export default function TreeWindow({
  mode,
  styles
}: {
  mode: ENavTreeMode
  styles?: CSSProperties
}) {
  const [open, setOpen] = useState({} as Record<number, boolean>)
  const [tabs, setTabs] = useState([] as chrome.tabs.Tab[])
  const [tabRelationships, setTabRelationships] = useState(
    {} as Record<number, number[]>
  )
  const [windows, setWindows] = useState([] as number[])

  const timer = useRef<NodeJS.Timer>(null)

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
        console.log("windows:", _windows)
      } catch (error) {
        console.log("init tabs fail: ", error)
      }
    }
    init()

    if (mode === "newtab") {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        // console.log(changes, namespace)
        if (
          namespace === "local" &&
          (changes[EStorageKey.tabsTree] || changes[EStorageKey.activatedTabs])
        ) {
          init()
        }
      })
      // timer.current = setInterval(init, 1000)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [mode])

  return (
    <div style={styles}>
      {windows.map((id, idx) => {
        return (
          <div key={id} className={clsx("p-2")}>
            <Collapsible.Root
              className={clsx(
                "border border-opacity-10 hover:border-opacity-40 rounded-md p-2 transition-all",
                {
                  "border-gray-50": mode === ENavTreeMode.newtab,
                  "border-gray-500": mode === ENavTreeMode.content
                },
                {
                  "hover:border-blue-500 border-translate":
                    mode === ENavTreeMode.popup
                }
              )}
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
              <div
                className={clsx("h-[1px] w-full my-2", {
                  "bg-gray-50 bg-opacity-10 ": mode === ENavTreeMode.newtab,
                  "bg-gray-200 bg-opacity-40 ": mode === ENavTreeMode.content
                })}></div>
              <Collapsible.Content>
                <NavGroup
                  mode={mode}
                  tabs={tabs.filter((i) => i.windowId === id)}
                  relationship={tabRelationships}
                />
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        )
      })}
    </div>
  )
}
