import * as ContextMenu from "@radix-ui/react-context-menu"

import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon
} from "@radix-ui/react-icons"
import { DEFAULT_BING_WALLPAPER_DOMAIN, ENewtabMode } from "~types"
import React, { ReactNode, useEffect } from "react"
import {
  currentWallpaperStore,
  isLoadingWallpaperStore,
  settingConfigStore
} from "~store"
import {
  getWallpaperBase64FromUrl,
  onDownloadCurrentWallpaper,
  onGetCurrentWallpaper,
  onGetPrevOrNextWallpaper,
  onSetCustomWallpaperToStorage
} from "~utils/wallpaper"

import { addNote } from "~utils/storage"
import { generateId } from "~utils/browser"
import hotkeys from "hotkeys-js"
import { useAtom } from "jotai"

const SettingContainer = ({ children }: { children: ReactNode }) => {
  const [settingConfig, setSettingConfig] = useAtom(settingConfigStore)
  const [, setCurrentWallpaperBase64] = useAtom(currentWallpaperStore)
  const [systemShortcut, setSystemShortcut] = React.useState({ fullscreen: "" })
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [isLoading, setIsLoading] = useAtom(isLoadingWallpaperStore)
  const [mainKey, setMainKey] = React.useState("win")

  const commandLogic = async (isPrev = true) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      const { url, base64: _base64 } = await onGetCurrentWallpaper()
      const { urlbase } = await onGetPrevOrNextWallpaper(url, isPrev)
      let base64 = ""
      if (url.length === generateId().length) {
        base64 = _base64
      } else {
        base64 = await getWallpaperBase64FromUrl(
          `${DEFAULT_BING_WALLPAPER_DOMAIN}${urlbase}_UHD.jpg`
        )
      }

      setCurrentWallpaperBase64(base64)
    } catch (error) {
      console.log("get prev or next wallpaper failed. isPrev:", isPrev)
    } finally {
      setIsLoading(false)
    }
  }

  const onPrevWallpaper = function (event) {
    event.preventDefault()
    commandLogic(true)
  }
  const onNextWallpaper = function (event) {
    event.preventDefault()
    commandLogic(false)
  }

  const onOpenWallpaperMarket = function (event) {
    setSettingConfig((_config) => ({
      ..._config,
      showBrowserTreeNav: false,
      showWallpaperMarket: !_config.showWallpaperMarket
    }))
    event.preventDefault()
  }

  const onSwitchIsShowBookmark = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showBookmark: !_config.showBookmark
    }))
  }

  const onSwitchIsShowSearchBar = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showBrowserTreeNav: false,
      showBookmarkBar: false,
      showSearchBar: !_config.showSearchBar
    }))
  }

  const onSwitchIsShowTreeNav = function (event) {
    event?.preventDefault?.()
    setSettingConfig((_config) => ({
      ..._config,
      showBookmarkBar: false,
      showBrowserTreeNav: !_config.showBrowserTreeNav
    }))
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  function onCustomizeWallpaper() {
    const getBase64FromFile = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64)
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    }
    // create a file input, upload image, save it's base64 to chrome storage
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files[0]
      const base64 = await getBase64FromFile(file)
      setCurrentWallpaperBase64(base64)
      // just use a random id as url
      onSetCustomWallpaperToStorage(base64)
      input.remove()
    }
    input.click()
    // handle error
    input.onerror = (error) => {
      console.log("input error:", error)
      input.remove()
    }
  }

  useEffect(() => {
    // get system shortcut
    // get system os
    const os = navigator.platform
    const isMacOs = os.includes("Mac")
    setMainKey(isMacOs ? "⌘" : "Alt")
    if (isMacOs) {
      setSystemShortcut({
        fullscreen: "Ctrl+⌘+F"
      })
    } else {
      setSystemShortcut({
        fullscreen: "F11"
      })
    }
    // bind hotkeys
    if (isMacOs) {
      hotkeys("command+[", onPrevWallpaper)
      hotkeys("command+]", onNextWallpaper)
      hotkeys("command+.", onOpenWallpaperMarket)
      hotkeys("command+B", onSwitchIsShowBookmark)
      hotkeys("command+K", onSwitchIsShowSearchBar)
      hotkeys("Ctrl+command+N", onSwitchIsShowTreeNav)
    } else {
      hotkeys("cmd+[", onPrevWallpaper)
      hotkeys("cmd+]", onNextWallpaper)
      hotkeys("cmd+.", onOpenWallpaperMarket)
      hotkeys("cmd+B", onSwitchIsShowBookmark)
      hotkeys("cmd+K", onSwitchIsShowSearchBar)
      hotkeys("cmd+Shift+N", onSwitchIsShowTreeNav)
    }

    return () => {
      if (isMacOs) {
        hotkeys.unbind("command+[")
        hotkeys.unbind("command+]")
        hotkeys.unbind("command+.")
        hotkeys.unbind("command+B")
        hotkeys.unbind("command+K")
        hotkeys.unbind("Ctrl+command+N")
      } else {
        hotkeys.unbind("cmd+[")
        hotkeys.unbind("cmd+]")
        hotkeys.unbind("cmd+.")
        hotkeys.unbind("cmd+B")
        hotkeys.unbind("cmd+K")
        hotkeys.unbind("cmd+Shift+N")
      }
    }
  }, [])

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="ContextMenuTrigger">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent">
          <ContextMenu.Item
            className="ContextMenuItem"
            onClick={toggleFullScreen}>
            {isFullScreen ? "取消" : ""}全屏{" "}
            <div className="RightSlot">{systemShortcut.fullscreen}</div>
          </ContextMenu.Item>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Label className="ContextMenuLabel">
            🔨 Tools
          </ContextMenu.Label>
          {/* 树形浏览器资源工具 */}
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={settingConfig.showBrowserTreeNav}
            disabled={settingConfig.mode !== ENewtabMode.wallpaper}
            onCheckedChange={(v) => {
              setSettingConfig({ ...settingConfig, showBrowserTreeNav: v })
            }}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            树形导航 <div className="RightSlot">Ctrl+{mainKey}+N</div>
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Label className="ContextMenuLabel">
            页面风格
          </ContextMenu.Label>
          <ContextMenu.RadioGroup
            value={settingConfig.mode}
            onValueChange={(value) =>
              setSettingConfig({ ...settingConfig, mode: value as ENewtabMode })
            }>
            <ContextMenu.RadioItem
              className="ContextMenuRadioItem"
              value={ENewtabMode.wallpaper}>
              <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              壁纸Fans
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem
              className="ContextMenuRadioItem"
              value={ENewtabMode.note}>
              <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                <DotFilledIcon />
              </ContextMenu.ItemIndicator>
              便签 👨‍💻‍
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator className="ContextMenuSeparator" />

          <ContextMenu.Sub>
            <ContextMenu.SubTrigger
              className="ContextMenuSubTrigger"
              disabled={settingConfig.mode !== "wallpaper"}>
              壁纸Fans - 设置
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </ContextMenu.SubTrigger>
            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className="ContextMenuSubContent"
                sideOffset={2}
                alignOffset={-5}>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onPrevWallpaper as any}>
                  上一张 <div className="RightSlot">{mainKey}+[</div>
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onPrevWallpaper as any}>
                  下一张 <div className="RightSlot">{mainKey}+]</div>
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onDownloadCurrentWallpaper}>
                  下载当前壁纸… <div className="RightSlot">↓</div>
                </ContextMenu.Item>

                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onCustomizeWallpaper}>
                  自定义壁纸 🚀
                </ContextMenu.Item>

                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={onOpenWallpaperMarket as any}>
                  所有壁纸 <div className="RightSlot">{mainKey}+.</div>
                </ContextMenu.Item>
                <ContextMenu.Separator className="ContextMenuSeparator" />
                <ContextMenu.Label className="ContextMenuLabel">
                  页面组件
                </ContextMenu.Label>

                <ContextMenu.CheckboxItem
                  className="ContextMenuCheckboxItem"
                  checked={settingConfig.showSearchBar}
                  onCheckedChange={(value) => {
                    setSettingConfig((v) => ({ ...v, showSearchBar: value }))
                  }}>
                  <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
                    <CheckIcon />
                  </ContextMenu.ItemIndicator>
                  搜索框 <div className="RightSlot">{mainKey}+K</div>
                </ContextMenu.CheckboxItem>
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>

          <ContextMenu.Item
            disabled={settingConfig.mode !== ENewtabMode.note}
            className="ContextMenuItem"
            onClick={addNote}>
            添加便签
          </ContextMenu.Item>
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={settingConfig.showBookmark}
            onCheckedChange={(v) => {
              setSettingConfig({ ...settingConfig, showBookmark: v })
            }}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            书签 <div className="RightSlot">{mainKey}+B</div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={settingConfig.showReadItLater}
            onCheckedChange={(v) => {
              setSettingConfig({ ...settingConfig, showReadItLater: v })
            }}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            稍后阅读
          </ContextMenu.CheckboxItem>
          {/* clock component */}
          <ContextMenu.CheckboxItem
            className="ContextMenuCheckboxItem"
            checked={settingConfig.showClock}
            onCheckedChange={(v) => {
              setSettingConfig({ ...settingConfig, showClock: v })
            }}>
            <ContextMenu.ItemIndicator className="ContextMenuItemIndicator">
              <CheckIcon />
            </ContextMenu.ItemIndicator>
            显示时间
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

export default SettingContainer
