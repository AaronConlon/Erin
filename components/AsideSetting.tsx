import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { CgSize } from "react-icons/cg"
import { FaRegKeyboard } from "react-icons/fa"

import { asideSettingConfigStore, showAsideSettingStore } from "~store"
import { showPromiseToast } from "~utils/browser"
import {
  getConfigLocalAsideSetting,
  setConfigLocalAsideSetting
} from "~utils/storage"

import FullscreenFilterContainer from "./FullscreenFilterContainer"
import Shortcut from "./Shortcut"
import SearchBar from "./Wallpaper/SearchBar"

export default function () {
  const [showAsideSetting, setShowAsideSetting] = useAtom(showAsideSettingStore)
  const [config, setConfig] = useAtom(asideSettingConfigStore)
  const [showSearchBar, setShowSearchBar] = useState({
    0: "",
    1: "",
    2: ""
  })
  const [showWallpaperMarket, setShowWallpaperMarket] = useState({
    0: "",
    1: "",
    2: ""
  })
  const [showNavTreeInNewTab, setShowNavTreeInNewTab] = useState({
    0: "",
    1: "",
    2: ""
  })
  const [showBookmark, setShowBookmark] = useState({
    0: "",
    1: "",
    2: ""
  })

  const onCancel = () => {
    setShowAsideSetting(false)
  }

  const onSave = () => {
    // update config with browser function
    showPromiseToast({
      promiseValue: setConfigLocalAsideSetting(config),
      success: "保存成功",
      error: "保存失败"
    })
  }

  useEffect(() => {
    getConfigLocalAsideSetting().then((_conf) => {
      const {
        shortcut: {
          showBookmark,
          showWallpaperMarket,
          showTabTree,
          showSearchComponent
        }
      } = _conf

      setShowSearchBar({
        0: showSearchComponent.split("+")[0],
        1: showSearchComponent.split("+")[1],
        2: showSearchComponent.split("+")[2]
      })
      setShowWallpaperMarket({
        0: showWallpaperMarket.split("+")[0],
        1: showWallpaperMarket.split("+")[1],
        2: showWallpaperMarket.split("+")[2]
      })
      setShowNavTreeInNewTab({
        0: showTabTree.split("+")[0],
        1: showTabTree.split("+")[1],
        2: showTabTree.split("+")[2]
      })
      setShowBookmark({
        0: showBookmark.split("+")[0],
        1: showBookmark.split("+")[1],
        2: showBookmark.split("+")[2]
      })
    })
  }, [])

  const isUsedShortcut = (key: string) => {}

  if (showAsideSetting) return null

  return (
    <FullscreenFilterContainer
      onClickOutside={() => setShowAsideSetting(false)}>
      <div className="absolute top-0 bottom-0 w-[400px] h-screen overflow-y-auto border-l border-gray-400 bg-white text-left flex flex-col gap-2 right-0">
        {/* size */}
        <div className="text-[13px] m-4 items-start border border-gray-300 rounded-lg">
          <div className="flex gap-4 border-b border-gray-200 p-4">
            <span className="text-blue-500">
              <CgSize size={32} />
            </span>
            {/* 快捷键 */}
            <div>
              <h3 className="text-[18px] font-bold">组件尺寸</h3>
              <p className="opacity-60">按需调整各个组件的尺寸</p>
            </div>
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">书签栏大小：</h4>
            <input
              className="p-2 py-1 border rounded-md"
              min={20}
              max={36}
              type="number"
              value={config.bookmark.iconSize}
              onChange={(e) => {
                setConfig({
                  ...config,
                  bookmark: {
                    ...config.bookmark,
                    iconSize: Number(e.target.value)
                  }
                })
              }}
            />
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">搜索框大小：</h4>
            <input
              className="p-2 py-1 border rounded-md"
              min={20}
              max={36}
              type="number"
              value={config.searchBar.iconSize}
              onChange={(e) => {
                setConfig({
                  ...config,
                  searchBar: {
                    ...config.searchBar,
                    iconSize: Number(e.target.value)
                  }
                })
              }}
            />
          </div>
        </div>

        {/* shortcut */}
        <div className="text-[13px] m-4 items-start border border-gray-300 rounded-lg">
          <div className="flex gap-4 border-b border-gray-200 p-4">
            <span className="text-blue-500">
              <FaRegKeyboard size={32} />
            </span>
            {/* 快捷键 */}
            <div>
              <h3 className="text-[18px] font-bold">快捷键(💪🏻开发中...)</h3>
              <p className="opacity-60">使用快捷键自定义操作</p>
            </div>
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">显示搜索框：</h4>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 0: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}>
              {showSearchBar[0]}
            </span>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 1: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}>
              {showSearchBar[1]}
            </span>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 2: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}>
              {showSearchBar[2]}
            </span>
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">显示壁纸列表：</h4>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showWallpaperMarket).includes(e.key)) {
                  return
                }
                setShowWallpaperMarket((prev) => ({ ...prev, 0: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 1: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 2: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">显示书签栏：</h4>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 0: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 1: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 2: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
          </div>
          <div className="p-4 flex gap-4 items-center">
            <h4 className="mr-auto">显示标签树状列表：</h4>
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 0: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 1: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
            <span
              className="p-2 py-1 border rounded-md w-16 text-center min-h-[28.5px]"
              onKeyDown={(e) => {
                if (Object.values(showSearchBar).includes(e.key)) {
                  return
                }
                setShowSearchBar((prev) => ({ ...prev, 2: e.key }))
                e.preventDefault()
                e.stopPropagation()
              }}
            />
            {}
          </div>
          <Shortcut
            title="显示稍后阅读："
            shortcut={""}
            onChange={(e) => {}}
            hadBeUsed={(e: string) => {
              return true
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 px-4 flex justify-end gap-4 text-[14px]">
          <button
            className="border border-gray-100 text-gray-500 px-4 py-2 rounded-sm"
            onClick={onCancel}>
            取消
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-sm border border-transparent"
            onClick={onSave}>
            保存
          </button>
        </div>
      </div>
    </FullscreenFilterContainer>
  )
}
